// import { redirect } from "next/navigation";
// export default function Home() {
//   redirect('/account/login');
// }
function ViewPdf() {
  return (
    <iframe
        src="https://www.redalyc.org/pdf/3236/323627681002.pdf"
        frameborder="0"
        width={"100%"}
        height={"100vh"}
        className="w-full"
        allowfullscreen
    />
  )
}

export default ViewPdf