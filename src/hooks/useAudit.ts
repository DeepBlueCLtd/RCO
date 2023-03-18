import { useEffect } from 'react'
import { useAuthState, useCreate, useGetIdentity, useLogout} from "react-admin";


const useAudit = () => {
  const { authenticated, isLoading }= useAuthState()
  const { data: identity, isLoading: identityLoading } = useGetIdentity();
  const [create] = useCreate()

  console.log('authenticated', authenticated)

  useEffect(() => {

    const userInfo = JSON.parse(localStorage.userInfo);

    if (create) {
      if(!identityLoading ) {
        if (authenticated && identity) {
          const id = identity.id
          // LOGIN
          const time = new Date()
          create('audits', { data: {
            id: JSON.stringify(time.getTime()),
            userId: Number(id),
            'date-time': time,
            'activity-type': 'Login'
          }})
        } else {
          //Log Out
          const time = new Date();
          create('audits', { data: {
            id: JSON.stringify(time.getTime()),
            userId: Number(userInfo?.id),
            'date-time': time,
            'activity-type': 'Log out'
          }})
        }
       
      } 
    
    
    }
  }, [authenticated, create, identity])
}

export default useAudit