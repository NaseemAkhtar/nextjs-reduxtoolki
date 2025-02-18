
import { getServerSession } from "next-auth";
import { options } from "./api/auth/[...nextauth]/auth";
import { store } from "@/store/store";
import { fetchUser } from "@/store/slice/user.slice";

export default async function Home() {
  const serverSession = await getServerSession(options)
  let userServerData
  if(serverSession?.user){
    // console.log('serverSession......',serverSession)
    await store.dispatch(fetchUser(serverSession))
    userServerData = store.getState()
  }

  console.log('userServerData.......?????',serverSession, userServerData)
  return (
    <div className="container flex flex-col md:flex-row gap-5 h-[calc(100vh-4rem)] justify-center">
        <div className="home-page flex flex-col justify-center text-center md:basis-2/3">
          <p className="text-yellow">Protect all the birds</p>
          <h1>The world's <span className="text-yellow">Rarest</span> Birds</h1>
          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book</p>
        </div>
    </div>
  );
}
