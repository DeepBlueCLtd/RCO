import { useGetIdentity } from "react-admin";

export const Dashboard = () => {
    const { data: identity } = useGetIdentity();
    return (
        <>
            <h4 className="text-center">Welcome {identity?.name} ({identity?.isAdmin ? "admin" : "user"})</h4>
        </>
    )
}