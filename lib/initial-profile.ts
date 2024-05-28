
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

export const initialProfile = async () => {
    const user = await currentUser(); // get the current user
    if (!user) {
        return redirectToSignIn();
    }
    const profile = await db.profile.findUnique({
        where: {
            userId: user.id,
        }
    });
    if (profile) {
        return profile;
    }
    const newProfile = await db.profile.create({
        data: {
            userId: user.id,
            name: `${user.firstName} ${user.lastName}`, // Use template literal for string concatenation
            imageUrl: user.imageUrl,
            email: user.emailAddresses[0].emailAddress,
        },
    });
    return newProfile;
    
}