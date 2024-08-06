// import { type Session } from "@supabase/supabase-js";
// type AuthEvent =
//   | "INITIAL_SESSION"
//   | "SIGNED_IN"
//   | "SIGNED_OUT"
//   | "PASSWORD_RECOVERY"
//   | "TOKEN_REFRESHED"
//   | "USER_UPDATED";

// type AuthSubscription = {
//   unsubscribe: () => void;
// };

export function useAuthListeners() {
  // const client = useSupabaseClient();
  // const handleAuthStateChange = (
  //   authEvent: AuthEvent,
  //   callback: (event: AuthEvent, session: any) => void
  // ) => {
  //   const {
  //     data: { subscription },
  //   } = client.auth.onAuthStateChange((event, session) => {
  //     if (event === authEvent) callback(event, session);
  //   });
  //   const authSubscription = subscription as AuthSubscription;
  //   // Return a function to cancel the subscription
  //   return () => {
  //     if (authSubscription) {
  //       authSubscription.unsubscribe();
  //     }
  //   };
}

// const useAuthEvent = (
//   authEvent: AuthEvent,
//   callback: (event: AuthEvent, session: Session | null) => void
// ) => {
//   let unsubscribe: (() => void) | undefined;

//   onMounted(() => {
//     unsubscribe = handleAuthStateChange(authEvent, callback);
//   });

//   onUnmounted(() => {
//     if (unsubscribe) {
//       unsubscribe();
//     }
//   });
// };

// return {
//   handleAuthListener: handleAuthStateChange,
//   useAuthEvent,
// };
// }
