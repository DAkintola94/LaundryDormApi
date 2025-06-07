
import profilePic from "../../assets/aboutpicture.jpg"
import {NavbarDefault} from "../NavbackgroundDefault/NavbackgroundDefault"

export const About = () => {
  return (
    <>
    <div> <NavbarDefault /> </div>
    <section id="about-us" className="py-16">
        <div className="container mx-auto py-2 flex">
            <div className="w-1/2 flex flex-col px-16 justify-center text-center">
            <h2 className="text-3xl font-bold mb-5">
                Om meg
            </h2>
            <p> Dette prosjektet ble utviklet med inspirasjon fra en konkret utfordring jeg opplevde i hverdagen. 
                I en tidligere boligblokk hadde vi kun én felles vaskemaskin, og reservasjonssystemet var helt manuelt, man måtte fysisk gå ned i kjelleren og henge opp leilighetsnummeret på en kalender. 
                Dette var lite fleksibelt og upraktisk, noe som ga meg ideen om å lage en digital løsning. 
                <br/> Målet med prosjektet var å utvikle et brukervennlig reservasjonsverktøy for fellesvaskemaskiner, med fokus på tilgjengelighet, effektivitet og enkel administrasjon. 
                Jeg valgte å bruke React, selv om dette ikke var en del av pensum i studiet mitt. 
                Prosjektet ble derfor også en anledning til å lære ny teknologi på egen hånd. <br/>
                Jeg studerer IT og informasjonssystemer ved Universitetet i Agder og går tredje året på bachelorprogrammet. 
                Prosjektet er et selvstendig initiativ laget på fritiden, og jeg håper det både viser min tekniske kompetanse og evne til å løse reelle problemer.
                
            </p>
            </div>

            <div className="w-1/2 relative">
            <img  className="w-full relative z-10" src={profilePic} alt="About us picture"/>
            <div className="bg-indigo-900 h-full w-full absolute top-6 -left-6"> 
            </div>

            </div>

        </div>

        
    </section>
    </>
  );
};
