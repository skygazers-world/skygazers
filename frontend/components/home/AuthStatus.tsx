import { signOut, useSession } from "next-auth/react";

export const AuthStatus = () => {
    const { data: session } = useSession();
    // const loading = status === "loading";
    // const { disconnect } = useDisconnect();

    return (

        <div>
            <p>
                {session?.user && (
                    <>
                        <span >
                            <small>You're authenticated for this session</small>
                        </span>
                        <a
                            href={`/api/auth/signout`}
                            className="button btn"
                            onClick={(e) => {
                                e.preventDefault()
                                // disconnect()
                                signOut()
                            }}
                        >
                            Sign out
                        </a>
                    </>
                )}
            </p>
        </div>
    )
}