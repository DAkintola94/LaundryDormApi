import React, { useEffect } from 'react'
import {Fragment, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { NavbarDefault } from '../NavbackgroundDefault/NavbackgroundDefault'
import { FooterDefault } from '../FooterDefault/FooterDefault'
import {Menu, Transition} from '@headlessui/react'
import {EllipsisVerticalIcon} from '@heroicons/react/24/outline'
import {ChevronLeftIcon, ChevronRightIcon} from '@heroicons/react/24/solid'
import {
  add, 
  eachDayOfInterval, endOfMonth,
  format,
  getDay,
  isEqual, isSameDay, isSameMonth, isToday,
  parse, parseISO,
  startOfToday,
} from 'date-fns'
import axios from 'axios'

function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

type statusData = { //must match the viewmodel name of the backend. cascalCase!
      //when ASP.NET Core sends this as JSON, it automatically converts to camelCase
      sessionId: number | null; 
      reservationTime: string | null;
      reservationDate: string | null;
      userMessage: string | null;
      startPeriod: string;
      endPeriod: string;
      laundryStatusDescription: string | null;
      machineName: string | null;
      imageUrlPath: string | undefined; //Based on what the seeded foreignkey backend is serving. Url path of the image that server serve
      nameOfUser: string | null;
}

export const Status = () => {

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 
  // Loads VITE_API_BASE_URL from the environment variables based on the current Vite mode.
  // if running in 'docker' mode, it uses variables from `.env.docker`; otherwise, it falls back to .env.local or .env.[mode].

  console.log("Backend API URL, docker mode:", import.meta.env.VITE_API_BASE_URL);

  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");
  const [loading, setLoading] = useState(false);


  const [calenderData, setCalenderData] = useState<statusData[]>([]); //Need to convert the list to array in-order to use external methods like map, filter, some etc. 

  useEffect(() => {
    const fetchTodayData = async () => {
      setLoading(true);
      await axios.get(`${API_BASE_URL}/api/Laundry/PopulateAvailability`,
        {
          headers: {"Authorization" : `Bearer ${token}`}
        })
        .then(response => {
          setLoading(false);
          setCalenderData(response.data);
          //console.log(response.data); //See the data server is returning, as well as the property name
        })
        .catch(err => {
          setLoading(false);
          console.log("An error occured", err);
        })
    }
    if(token){
      fetchTodayData();
    }
    else {
      const errorMessage = "Unauthorized user, please log in or contact admin"

      navigate('/error404', {
        replace: true,
        state: {
          errMessage: errorMessage
        }
      })
    }
  }, [token, navigate, API_BASE_URL])


  const today = startOfToday()
  const [selectedDay, setSelectedDay] = useState(today);
  const [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'));
  const firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date()); // Parse the current month string (e.g., "Jul-2025") back into a Date object

  const [formDate, setFormDate] = useState<string>("");

  //useEffect based on existing date selected, so form is not empty
   useEffect(() => {
    setFormDate(format(selectedDay,'yyyy-MM-dd')); //setting formDate into whatever user select
  }, [selectedDay]);

  const days = eachDayOfInterval({ //inbuildt method
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  })

  console.log(selectedDay);

  function previousMonth(){
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1}) //sets the month according to the arrow we point, by -1 in this case
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'))
  }

  function nextMonth(){
    const firstDayNextMonth = add(firstDayCurrentMonth, {months: 1})
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'))
  }

  const selectedLaundryDate = calenderData.filter((populateCalender) =>  
    isSameDay(parseISO(populateCalender.startPeriod), selectedDay)
)

const colStartClasses = [
  '',
  'col-start-2',
  'col-start-3',
  'col-start-4',
  'col-start-5',
  'col-start-6',
  'col-start-7',
]

const [pending, setPending] = useState(false);
const [formError, setFormError] = useState("");
//const [message, setMessage] = useState('');
const [machineId, setMachineId] = useState('1'); //value for the machine id, default value need to be 1 so it doesn't become 0
const [laundrySessionTime, setSessionTime] = useState('1');

const handleSubmit = async(e:React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const reserveLaundry = {
    machineId: Number(machineId),
    sessionTimePeriodId: Number(laundrySessionTime),
    reservationDate : formDate, //Since backend is expecting DateOnly, this works
  };

  if(!token){
    const sendError = "Unauthorize user"
    navigate('/error404', {
      replace:true,
      state: {
        errMessage: sendError
      }
    })
    return;
  }

  setPending(true);

  try{
    const sendData = await axios.post(`${API_BASE_URL}/api/Laundry/SetReservation`,
           reserveLaundry, //This is the body, Axios automatically JSON-stringifies the request body, no need to json.stringify
           {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
          })
          setPending(false);
          if(sendData.status === 200){ //reload the page if our data is successfully sent. So we can see dot on calender.
            window.location.reload();
          }
  }
  catch (err:unknown){
    if(axios.isAxiosError(err) && err.response){

      console.error("Backend error", err.response.status);
      //Since backend is sending back plain string upon error, and not JSON with message property
      setFormError(`Error! ${err.response.data || "Something went wrong"}`); //.data to get the text error
      setPending(false);

    } else if (axios.isAxiosError(err) && err.request){
      //No response received (e.g., server down)
      console.error('No response from the server:', err.request);
      setFormError("No response from server, please try again later");
      setPending(false);
      
    } else {
      console.error("An unexpected error occured", err);
      setFormError("An unexpected error occured" + err);
      setPending(false);
    }
  }
}

  return (
    <>
    <div> <NavbarDefault />
    <div className="pt-16">
      <div className="max-w-md px-4 mx-auto sm:px-7 md:max-w-4xl md:px-6">
        <div className="md:grid md:grid-cols-2 md:divide-x md:divide-gray-200">
          <div className="md:pr-14">
            <div className="flex items-center">
              <h2 className="flex-auto font-semibold text-gray-900"> 
                {format(firstDayCurrentMonth, 'MMMM yyyy')}
              </h2>
              <button
              type="button"
              onClick={previousMonth}
              className="-my-15 flex flex-none items-center justify-center p-1.5 text-black hover:text-gray-500"
              >
                <span className="sr-only"> Forrige måned</span>
                <ChevronLeftIcon className="w-5 h-5" aria-hidden="true" />
              </button>

              <button
              type="button"
              onClick={nextMonth}
              className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-black hover:text-gray-500"
              >
                <span className="sr-only"> Neste måned </span>
                <ChevronRightIcon className="w-5 h-5" aria-hidden="true"/>
              </button>
            </div>
            <div className="grid grid-cols-7 mt-10 text-xs leading-6 text-center text-black">
              <div>Søn</div>
              <div>Man</div>
              <div>Tirs</div>
              <div>Ons</div>
              <div>Tors</div>
              <div>Fre</div>
              <div>Lør</div>
            </div>
            <div className="grid grid-cols-7 mt-2 text-sm">
              {days.map((day, dayIdx) => ( //Looping into the const day, which is the inbuildt method eachDayOfInterval, with custom start and end
              <div
              key={day.toString()} // Unique identifier for React to track each calendar day element
              className={classNames(
                 dayIdx === 0 && colStartClasses[getDay(day)],
                 'py-1.5'
              )}
              >
                {/* Part responsible for styling each calendar day button based on different states and conditions. 
                Shows certain color based on the day choosen
                */}
                <button
                type="button"
                onClick={() => setSelectedDay(day)}
                className={classNames(
                  isEqual(day, selectedDay) && 'text-white',
                  !isEqual(day, selectedDay) && 
                    isToday(day) &&
                    'text-red-500',
                  !isEqual(day, selectedDay) && 
                    !isToday(day) &&
                    isSameMonth(day, firstDayCurrentMonth) &&
                    'text-gray-900',
                  !isEqual(day, selectedDay) && 
                    !isToday(day) && 
                    !isSameMonth(day, firstDayCurrentMonth) &&
                    'text-gray-400',
                  isEqual(day, selectedDay) && isToday(day) && 'bg-red-500',
                  isEqual(day, selectedDay) && 
                    !isToday(day) &&
                    'bg-gray-900',
                  !isEqual(day, selectedDay) && 'hover:bg-gray-200',
                  (isEqual(day, selectedDay) || isToday(day)) &&
                    'font-semibold',
                    'mx-auto flex h-8 w-8 items-center justify-center rounded-full'
              )} 
                >
                  {/*Showing days in number*/}
                  <time dateTime={format(day, 'yyyy-MM-dd')}>
                    {format(day, 'd')}
                  </time>
                </button>
                  
                {/* The part that shows a small blue dot indicator for the days that have booking/scheduled */}
                <div className="w-1 h-1 mx-auto mt-1">
                  {calenderData.some((sessionCalender) => 
                  isSameDay(parseISO(sessionCalender.startPeriod), day)
                  ) && (
                    <div className="w-1 h-1 rounded-full bg-sky-500"></div>
                  )} 
                </div>
              </div>
              ))}
            </div>
          </div>
          <section className="mt-12 md:mt-0 md:pl-14">
            <h2 className="font-semibold text-gray-900"> 
              Booket {' '}
              <time dateTime={format(selectedDay, 'yyyy-MM-dd')}>
                {format(selectedDay, 'MMM dd, yyyy')}
              </time>
            </h2>
            <ol className="mt-4 space-y-1 text-sm leading-6 text-gray-500">
              {
              loading? (<p>
                <img src="../../assets/spinloading.svg" title='Loading image' className="h-[5vh] w-[5vh]" />
                   Henter data
              </p>) :

              selectedLaundryDate.length > 0 ? (    
                selectedLaundryDate.map((scheduleCalender) => (
                  <Schedule schedule={scheduleCalender} key={scheduleCalender.sessionId} />
                ))
              ) : (
                <p> Ingen vask booket idag.</p>
              )}
            </ol>
            
            {
              formError && <span className="text-red-600"> {formError} </span>
            }
          </section>
        </div>
      </div>
    </div>

    <div className="flex py-6 justify-start items-start;">
      <div className="ml-[300px] mt-[0px]"> 
        <form onSubmit={handleSubmit}>
          
        <input className="bg-gray-50 border border-gray-300 text-black font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2
         dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white mb-2"placeholder="Dato..." value={formDate} readOnly 
         aria-label='Dato' id="datoId"
         />

          <select id="machineId" aria-label='velg-maskin'
            className="bg-gray-50 border border-gray-300 text-black font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2
            dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-2"
              onChange={(evt) => setMachineId(evt.target.value)}>
                <option value="1"> Siemen vaskemaskin </option>
                <option value="2"> Samsung vaskemaskin </option>
            </select>

            <select id="tidspunktId" aria-label='velg-tidspunkt'
              className="bg-gray-50 border border-gray-300 text-gray-900 font-bold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2
              dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                 onChange={(evt) => setSessionTime(evt.target.value)}>
                  <option value="1">kl. 07:00 - 12:00</option>
                  <option value="2">kl. 12:00 - 17:00</option>
                  <option value="3">kl. 17:00 - 22:00</option>
            </select>

         {!pending && <button type="submit" 
                className="mt-1 mx-auto mb-2 p-1 border rounded w-full max-w-md bg-blue-600 hover:bg-blue-700 text-white font-bold items-center justify-center flex">
                Reserve vask</button>} {/*mt is for margin-top, gives space between labels/form*/}

                {pending &&
                  <button disabled className=" mt-1 mb-4 p-2 border rounded w-full max-w-md bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center"> {/*Move the button center instead*/}
                    {pending ? (
                      <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                      </svg>
                    ) : (
                      <span className="w-5 h-5 mr-3" /> // invisible spacer. In other word, we are leaving only "w-5 h-5 mr-3" again, and not rendering the circle/path 
                    )}
                    Behandler data
                  </button>
                }
        </form>
      </div> 
    </div>
    <FooterDefault />
  </div>
    </>
  )
}

function Schedule({ schedule }: { schedule: statusData}) { 
//This function can read the meeting variable that is in another scope because,
// we have declared the componenet and its key/parameter there 
//<Meeting meeting={meeting} key={meeting.id} />

  const startDateTime = parseISO(schedule.startPeriod)
  const endDateTime = parseISO(schedule.endPeriod)

  return(
    <li className="flex items-center px-4 py-2 space-x-4 group rounded-xl focus-within:bg-gray-100 hover:bg-gray-100">
      <img
      src={schedule.imageUrlPath}
      alt=""
      className="flex-none w-10 h-10 rounded-full"
      />
      <div className="flex-auto">
        <p className="text-gray-900">{schedule.nameOfUser}</p>
        <p className="mt-0.5">
          <time dateTime={schedule.startPeriod}>
            {format(startDateTime, 'h:mm a')}
          </time>{' '}
          -{' '}
          <time dateTime={schedule.endPeriod}>
            {format(endDateTime, 'h:mm a')}
          </time>
        </p>
        <p className="text-gray-900">Status: {schedule.laundryStatusDescription}</p>
      </div>
      <Menu
        as="div"
        className="relative opacity-0 focus-within:opacity-100 group-hover:opacity-100"
      >
        <div>
          <Menu.Button className="-m-2 flex items-center rounded-full p-1.5 text-gray-500 hover:text-gray-600">
            <span className="sr-only">Open options</span>
            <EllipsisVerticalIcon className="w-6 h-6" aria-hidden="true" />
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 mt-2 origin-top-right bg-white rounded-md shadow-lg w-36 ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'block px-4 py-2 text-sm'
                    )}
                  >
                    Edit
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'block px-4 py-2 text-sm'
                    )}
                  >
                    Cancel
                  </a>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </li>
  )
}
