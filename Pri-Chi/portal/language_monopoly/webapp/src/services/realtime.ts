import { useEffect, useRef } from "react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  getGameSnapshot,
  useGameStore,
  createSnapshot,
} from "../store/gameStore";
import type { GameStoreStateSnapshot } from "../store/gameStore";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const useRealtimeRoom = (roomCode?: string) => {
  const selfId = useGameStore((state) => state.selfId);
  const enabled = Boolean(supabaseUrl && supabaseKey && roomCode);
  const clientRef = useRef<SupabaseClient | null>(null);
  const channelRef =
    useRef<ReturnType<SupabaseClient["channel"]> | null>(null);
  const suppressRef = useRef(false);

  useEffect(() => {
    if (!enabled || !roomCode) {
      return;
    }
    const client = createClient(supabaseUrl!, supabaseKey!);
    const channel = client.channel(`language_monopoly:${roomCode}`);
    channel
      .on("broadcast", { event: "state" }, (payload) => {
        if (payload.payload?.sender === selfId) return;
        const incoming = payload.payload
          ?.state as GameStoreStateSnapshot | undefined;
        if (incoming) {
          suppressRef.current = true;
          useGameStore.getState().actions.syncFromRemote(incoming);
        }
      });
    channel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        channel.send({
          type: "broadcast",
          event: "state",
          payload: { sender: selfId, state: getGameSnapshot() },
        });
      }
    });
    clientRef.current = client;
    channelRef.current = channel;
    return () => {
      channel.unsubscribe();
      client.removeAllChannels();
      clientRef.current = null;
      channelRef.current = null;
    };
  }, [enabled, roomCode, selfId]);

  useEffect(() => {
    if (!enabled || !roomCode) return;
    const unsubscribe = useGameStore.subscribe((state) => {
      if (suppressRef.current) {
        suppressRef.current = false;
        return;
      }
      if (!channelRef.current) return;
      const snapshot = createSnapshot(state as any);
      channelRef.current.send({
        type: "broadcast",
        event: "state",
        payload: { sender: selfId, state: snapshot },
      });
    });
    return () => unsubscribe();
  }, [enabled, roomCode, selfId]);
};

