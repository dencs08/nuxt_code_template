import { serverSupabaseServiceRole } from "#supabase/server";
import { validRoles } from "@/utils/roles";

export async function assignRole(
  event: any,
  body: { id: string; role: string }
) {
  const client = serverSupabaseServiceRole(event);
  await checkUserRole(event, "admin");

  const userRole = await getUserRole(event);

  if (!validRoles.map((role) => role.value).includes(body.role)) {
    throw createError({
      statusCode: 500,
      statusMessage: "Invalid or missing data",
    });
  }

  const { data: currentUserData, error: currentUserError } = await client
    .from("user_roles")
    .select("role")
    .eq("user_id", body.id)
    .single();
  if (currentUserError) {
    throw createError({
      statusCode: 500,
      statusMessage: "Error retrieving current user role",
    });
  }

  if (
    userRole === "admin" &&
    (currentUserData.role === "admin" || currentUserData.role === "superadmin")
  ) {
    throw createError({
      statusCode: 500,
      statusMessage:
        "Admins cannot change the role of other admins or superadmins",
    });
  }

  if (userRole !== "superadmin" && body.role === "superadmin") {
    throw createError({
      statusCode: 500,
      statusMessage: "Only superadmins can assign the superadmin role",
    });
  }

  try {
    //@ts-ignore
    const { data, error } = await client
      .from("user_roles")
      .upsert({
        user_id: body.id,
        role: body.role,
      })
      .eq("user_id", body.id) // Make sure to update only the passed body.id
      .select();

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: "Error updating user role",
      });
    }
    return { response: "User role updated" };
  } catch (err) {
    throw createError({
      statusCode: 500,
      statusMessage: "An error occurred during the update process",
    });
  }
}
