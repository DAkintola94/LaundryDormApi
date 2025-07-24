import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { NavbarDefault} from '../NavbackgroundDefault/NavbackgroundDefault'
import { FooterDefault} from '../FooterDefault/FooterDefault'
import { IoIosInformationCircle } from 'react-icons/io'
import { MdError } from 'react-icons/md'


export const ViewReport = () => {
  type ReportData = { //must match the viewmodel name of the backend. cascalCase!
    //when ASP.NET Core sends this as JSON, it automatically converts to camelCase

    posterId: number;
    authorName: string;
    informationMessage: string;
    emailAddress: string;
    date: string;
    reportStatus: string; // Optional since it might be added by backend
    categoryName: string; // Optional, might be populated via join with category table
  };

  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [modalValue, setModalState] = useState<ReportData | null>(null);
  const [isExpanded, setExpandedCards] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("access_token");

const toggleCardExpansion = (posterId: number) => {
  setExpandedCards(prev => {
    const newSet = new Set(prev);
    if(newSet.has(posterId)) {
      newSet.delete(posterId);
    } else {
      newSet.add(posterId);
    }
    return newSet;
  });
};

  useEffect(() => {
    const fetchData = async () => {
      await axios.get('https://localhost:7054/api/Advice/FetchAdvice',
  {
    headers: {"Authorization" : `Bearer ${token}`}
  })
  .then(response => {
    setReportData(response.data);
    console.log(response.data);
    setLoading(false);
  })
  .catch(err => {
    console.log( "An error occured when trying to fetch data",err);
    setLoading(false);
  })
    }
    if(token){
      fetchData();
    } else {
      console.log("Unauthorized user");
    }
  }, [token])


  return (
    <div className="min-h-screen flex flex-col">
      <NavbarDefault/>
      <div className="container mx-auto px-4 my-6">
        <h1 className="text-3xl font-bold md-6 text-center"> Rapporter </h1>
        {loading? (
          <div className="flex justify-center items-center h-64">
            <div className="flex items-center justify-center text-red-600 font-bold gap-2">
            <MdError className="text-xl" />
            <span> Ingen rapporter tilgjengelig </span>
          </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {reportData.map((report, index) => (
              <div key={report.posterId || index} className="bg-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                <h2 className="text-2xl font-bold mb-2">
                  {report.categoryName}
                </h2>
                <div className="text-gray-800 leading-relaxed mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Navn:</strong> {report.authorName}
                  </p>
                  {report.reportStatus && (
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Status:</strong> {report.reportStatus}
                    </p>
                  )}
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Dato:</strong> {report.date}
                  </p>
                  <p className={isExpanded? "" : "line-clamp-3"}>
                    {report.informationMessage}
                    </p>
                    {/* Show more/less button only if message is long */}
                    {report.informationMessage.length > 150 && (
                      <button 
                      onClick={() => toggleCardExpansion(report.posterId)}
                      className="text-blue-600 hover:text-blue-800 text-sm mt-2"
                      >
                        {isExpanded ? "Vis mindre" : "Vis mer"}

                      </button>
                    )}



                </div>

                <div className="mb-2 p-2">
                  <button
                  onClick={() => setModalState(report)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors">
                  <IoIosInformationCircle />
                  <span> Vis detaljer </span>
                  </button>
                </div>
                </div>
            ))}
          </div>
        )}
      </div>

      {/*Modal*/}
      {modalValue && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h2 className="text-lg font-bold md-4"> Rapport detaljer </h2>
          <div className="space-y-2 md-4">
            <p><strong>Navn:</strong>{modalValue.authorName || "Ikke oppgitt"}</p>
            <p><strong>Email:</strong>{modalValue.emailAddress || "Ikke oppgitt"}</p>
            <p><strong>Rapport ID:</strong> {modalValue.posterId || "Ikke oppgitt"}</p>
            <p><strong>Kategori:</strong> {modalValue.categoryName || "Ikke oppgitt"}</p>
            <p><strong>Dato:</strong> {modalValue.date || "Ikke oppgitt"}</p>
          </div>
          <button 
          onClick={() => setModalState(null)}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          > Lukk
          </button>
          </div>
        </div>
      )}
      <FooterDefault />
    </div>
  )
}
