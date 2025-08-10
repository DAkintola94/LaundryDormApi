
import {FaLinkedin, FaGithub} from "react-icons/fa"
import {IoIosInformationCircle} from "react-icons/io"

export const FooterDefault = () => {
  return (
    <>
      <footer className="bg-blue-500 flex flex-row flex-wrap items-center justify-center gap-x-12 gap-y-3 border-t border-slate-200 py-0 text-center md:justify-between fixed bottom-0 inset-x-0 z-50">
        <p className="font-sans antialiased text-base text-current">
     ©Laundrydorm 2025
    </p>
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <li>
                    <a title="report" href="/report" 
                    target="blank"
                    rel="noopener noreferrer"
                    className="">
                    <IoIosInformationCircle/>
                 </a>
                </li>
                <li>
                    <a title="linkedin" href="https://www.linkedin.com/in/dennis-oni-akintola/" 
                    target="blank"
                    rel="noopener noreferrer"
                    className="">
                    <FaLinkedin/>
                 </a>

                </li>
                <li>
                    <a title="github" href="https://github.com/DAkintola94" 
                    target="blank"
                    rel="noopener noreferrer"
                    className=""> <FaGithub/> </a>
                </li>
            </ul>
        </footer>
    </>
  )
}
