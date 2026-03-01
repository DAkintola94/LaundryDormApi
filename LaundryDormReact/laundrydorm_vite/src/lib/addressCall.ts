import axios from "axios";

 export type AddressResult = {
  addressName: string;
  municipalityName: string;
  postnummer: string;
  lat: number | null;
  lon: number | null;
  matrikkelNumber: string;
};

export async function GetAddressInformation(query: string){
    if(!query || query.length <= 0){
        return []
    }
    try {
        const response = await axios.get(`https://ws.geonorge.no/adresser/v1/sok?sok=${query}`, {
        });

        if (!response) return undefined

        const matrikkelNr = response.data.adresser[0].gardsnummer + "/" + response.data.adresser[0].bruksnummer; //Include municipalityNumber later on if needed
        const result_data = response.data.adresser ?? [];

        return result_data.map((item: any) => ({
    addressName: item.adressetekst ?? "",
    municipalityName: item.kommunenavn ?? "",
    postnummer: item.postnummer ?? "",
    lat: item.representasjonspunkt?.lat ?? null,
    lon: item.representasjonspunkt?.lon ?? null,
    matrikkelNumber: matrikkelNr 
  }));

        } catch{
            return [];
        }
}
