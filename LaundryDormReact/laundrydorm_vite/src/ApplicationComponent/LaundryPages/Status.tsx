import React, { useEffect } from 'react'
import {Fragment, useState} from 'react'
import { useNavigate } from 'react-router-dom'
//import { NavbarDefault } from '../NavbackgroundDefault/NavbackgroundDefault'
//import { FooterDefault } from '../FooterDefault/FooterDefault'
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

  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  const [calenderData, setCalenderData] = useState<statusData[]>([]); //Need to convert the list to array in-order to use external methods like map, filter, some etc. 

  useEffect(() => {
    const fetchTodayData = async () => {
      await axios.get('https://localhost:7054/api/Laundry/PopulateAvailability',
        {
          headers: {"Authorization" : `Bearer ${token}`}
        })
        .then(response => {
          setCalenderData(response.data);
          console.log(response.data); //See the data server is returning, as well as the property name
        })
        .catch(err => {
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
  }, [token, navigate])

  const today = startOfToday()
  const [selectedDay, setSelectedDay] = useState(today);
  const [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'));
  const firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date()); // Parse the current month string (e.g., "Jul-2025") back into a Date object

  const days = eachDayOfInterval({ //inbuildt method
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  })

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

  return (
    <>
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
                  {calenderData.some((sessionCalender) => //change later to accomodate the backend laundrytime
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
              {selectedLaundryDate.length > 0 ? (    //change later to accomodate the backend laundrytime
                selectedLaundryDate.map((scheduleCalender) => (
                  <Schedule schedule={scheduleCalender} key={scheduleCalender.sessionId} />
                ))
              ) : (
                <p> Ingen vask booket idag.</p>
              )}
            </ol>
          </section>
        </div>
      </div>
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
