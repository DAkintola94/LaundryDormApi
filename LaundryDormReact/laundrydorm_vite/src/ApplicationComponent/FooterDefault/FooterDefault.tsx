
import {FaLinkedin, FaGithub} from "react-icons/fa"
import {IoIosInformationCircle} from "react-icons/io"

export const FooterDefault = () => {
  return (
    <>
      <footer className="bg-blue-500 flex w-full flex-row flex-wrap items-center justify-center gap-x-12 gap-y-3 border-t border-slate-200 py-4 text-center md:justify-between">
        <p className="font-sans antialiased text-base text-current">
     ©Laundrydorm
    </p>
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <li>
                    <a href="/aboutus" 
                    target="blank"
                    rel="noopener noreferrer"
                    className="">
                    <IoIosInformationCircle/>
                 </a>
                </li>
                <li>
                    <a href="https://www.linkedin.com/in/dennis-akintola-294a6a285/" 
                    target="blank"
                    rel="noopener noreferrer"
                    className="">
                    <FaLinkedin/>
                 </a>

                </li>
                <li>
                    <a href="https://github.com/DAkintola94" 
                    target="blank"
                    rel="noopener noreferrer"
                    className=""> <FaGithub/> </a>
                </li>
            </ul>
        </footer>
    </>
  )
}
