import { signOut } from "next-auth/react"

export const Logout = () => {
  const handleLogout = async () => {
    try {
      signOut({ redirect: false });

    } catch (error) {
      window.alert(error)
    }
  }

  return (
    <>
      <button
        className='bigrounded bg-sggreen text-sgbodycopy ml-[11vw]'
        onClick={(e) => {
          e.preventDefault()

          handleLogout()

        }}
      >
        Log out
      </button>
    </>
  )
}
