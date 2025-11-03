
import profilePic from "../../assets/aboutpicture.jpg"
import { NavbarDefault } from "../NavbackgroundDefault/NavbackgroundDefault";
import { FooterDefault } from "../FooterDefault/FooterDefault";
import {FaLinkedin, FaGithub} from "react-icons/fa"
import {IoIosInformationCircle} from "react-icons/io"
import { FaYoutube } from "react-icons/fa";


export const About = ({hideNavbar = false, hideFooter = false} : {hideNavbar?:boolean, hideFooter?:boolean}) => {
                        //To be able to disable navbar and footer when exporting
  return (
    <>
    {!hideNavbar && <NavbarDefault />}
    <section id="about-us" className="py-16">
        <div className="container mx-auto py-2 flex">
            <div className="w-1/2 flex flex-col px-16 justify-center text-center">
            <h2 className="text-3xl font-bold mb-5">
                Litt om meg
            </h2>
            <p> Dette prosjektet ble utviklet med inspirasjon fra en konkret utfordring jeg opplevde i hverdagen. 
                I en tidligere boligblokk hadde vi kun én felles vaskemaskin, og reservasjonssystemet var helt manuelt, man måtte fysisk gå ned i kjelleren og henge opp leilighetsnummeret på en kalender. 
                Dette var lite fleksibelt og upraktisk, noe som ga meg ideen om å lage en digital løsning. 
                <br/> <br/> Målet med prosjektet var å utvikle et brukervennlig reservasjonsverktøy for fellesvaskemaskiner, med fokus på tilgjengelighet, effektivitet og enkel administrasjon. 
                Jeg valgte å bruke React, selv om dette ikke var en del av pensum i studiet mitt. 
                Prosjektet ble derfor også en anledning til å lære ny teknologi på egen hånd. Backenden er utviklet med ASP.NET og C#, og eksponerer funksjonalitet gjennom et REST API. REST API som ble brukt, måtte læres og tas i bruk på egen hånd. 
                <br/> <br/>
                Jeg studerer IT og informasjonssystemer ved Universitetet i Agder og går tredje året på bachelorprogrammet. 
                Prosjektet er et selvstendig initiativ laget på fritiden, og jeg håper det både viser min tekniske kompetanse og evne til å løse reelle problemer.
                <br></br>  
            </p>

                <div className="flex flex-row mt-10 gap-3 text-4xl">
                    <a title="Linkedin" href="https://www.linkedin.com/in/dennis-oni-akintola/">
                        <FaLinkedin className="ml-50"/>
                    </a>
                    <a href="https://www.youtube.com/watch?v=Sp2SCRbn-I4" title="Demo video">
                         <FaYoutube className=""/>
                    </a>

                    <a href="https://www.github.com/DAkintola94" title="Github">
                         <FaGithub className=""/>
                    </a>
                </div>
                

            </div>

            <div className="w-1/2 relative">
            <img  className="w-full relative z-10" src={profilePic} alt="About us picture"/>
            <div className="bg-indigo-900 h-full w-full absolute top-6 -left-6"> 
            </div>
            </div>
        </div>
    </section>
    {!hideFooter && <FooterDefault />}
    </>
  );
};
