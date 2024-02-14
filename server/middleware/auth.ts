export default defineEventHandler(async (event) => {
    // console.log(event.node.req.headers);
    // // Your Supabase URL and Service Role Key (use environment variables for security)
    // const supabaseUrl = process.env.SUPABASE_URL;
    // const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
    // // Initialize Supabase client
    // const supabase = createClient(supabaseUrl, supabaseAnonKey);
    // // Extract the token from the Authorization header
    // const token = event.node.req.headers.authorization?.split(" ")[1];
    // if (!token) {
    //     // Handle no token provided
    //     throw new Error("No authentication token provided");
    // }
    // // Verify the token with Supabase
    // const { user, error } = await supabase.auth.api.getUser(token);
    // if (error || !user) {
    //     // Handle invalid token
    //     throw new Error("Invalid or expired token");
    // }
    // // Token is valid, and user is authenticated
    // event.context.user = user;
});
