//import { useState, Fragment, useEffect } from "react";
import { useState, useEffect, useRef, useCallback } from "react";
//import { Listbox, Transition } from "@headlessui/react";
import Search from "../../assets/Images/search.png";
import Header from "../../components/Header/Header";
/*
import Crown from "../../assets/Images/crown.png";
import { IoMdArrowDropdown } from "react-icons/io";
import Category from "../../assets/Images/category.png";
import Calendar from "../../assets/Images/calendar.png";
*/
import AIData from "../../components/Home/AIData";
//import mainlogo from "../../assets/Images/logo-main.png";
import Footer from "../../components/Footer/Footer";
import {
  fetchApplicationData,
  fetchLLMSearchApplications,
  fetchSearchApplications,
} from "../../functions/apiFunctions";
// import refresh from "../../assets/Images/Refresh.png";
/*
interface Features {
  id: number;
  name: string;
}
interface Categories {
  id: number;
  name: string;
  category?: string;
}

interface Days {
  id: number;
  name: string;
}

const features: Features[] = [
  {
    id: 1,
    name: "Featured",
  },
  {
    id: 2,
    name: "Featured2",
  },
  {
    id: 3,
    name: "Featured3",
  },
];

const Categories: Categories[] = [
  {
    id: 1,
    name: "All Category",
  },
  {
    id: 2,
    name: "All Category1",
  },
  {
    id: 3,
    name: "All Category2",
  },
];
const Days: Days[] = [
  {
    id: 1,
    name: "Today",
  },
  {
    id: 2,
    name: "Yesterday",
  },
  {
    id: 3,
    name: "Tommorow",
  },
];

function classNames(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
*/
// interface HomeProps {
//   appData: any;
// }
const HomePage = () => {
  // let { appData } = props;
  /*
  const [feature, setFeatures] = useState(features[0]);
  const [category, setCategory] = useState(Categories[0]);
  const [day, setDay] = useState(Days[0]);
  */
  const [searchTerms, setSearchTerms] = useState("");
  const [appData, setAppData] = useState([]);
  const [searchAppData, setSearchAppData] = useState([]);
  const [searchAppDataUncurated, setSearchAppDataUncurated] = useState([]);
  const [searchLlmData, setSearchLlmData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPressEnter, setIsPressEnter] = useState(false);
  //const [excludeApplications, setExcludeApplications] = useState<string[]>([]);

  const [hasMore, setHasMore] = useState(true);
  //const [skip, setSkip] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const limit = 5; // Number of items to fetch at a time
  // References to prevent stale closures
  //const containerRef = useRef<HTMLDivElement>(null);
  const isFetchingRef = useRef(false);
  //const hasMoreRef = useRef(true);

  const fetchData = async () => {
    if (isFetchingRef.current || isLoading || !hasMore) return;
    //console.log("Fetching data with skip:", skip);
    isFetchingRef.current = true;

    setIsLoading(true);

    try {
      const appResponse = await fetchApplicationData((page - 1) * limit, limit);
      // console.log("Fetched data:", appResponse);
      setAppData((prev) => [...prev, ...appResponse]);
      if (appResponse.length < limit) {
        setHasMore(false); // No more data to fetch
        // chk hasMoreRef.current = false; // Update reference
      }
    } catch (err) {
      // console.log("Failed to fetch data from the application API:", err);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  };
  // Trigger fetching on `skip` change
  /*
  useEffect(() => {
    if (skip === 0) return; // Avoid initial fetch here
    fetchData();
  }, [skip]);
*/
  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  const handleScroll = useCallback(
    (e: any) => {
      const container = e.target;
      if (
        container.scrollHeight - container.scrollTop <=
          container.clientHeight + 100 &&
        !isLoading &&
        hasMore
      ) {
        setPage((prev) => prev + 1);
      }
    },
    [isLoading, hasMore]
  );

  useEffect(() => {
    if (page === 1) return;
    loadData();
  }, [page]);

  const loadData = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const data = await fetchApplicationData((page - 1) * limit, limit);
      if (data.length < limit) setHasMore(false);
      setAppData((prev) => [...prev, ...data]);
    } catch (error) {
      // console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger fetching on `skip` change
  /*
  useEffect(() => {
    if (skip !== 0) {
      fetchData();
    }
  }, [skip]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);
  */

  const fetchSearchData = async () => {
    setIsLoading(true);

    const data = { search_terms: searchTerms };
    /*
    const llmData = {
      search_text: searchTerms,
      result_count: 8,
      exclude_applications: excludeApplications, // Use dynamic list here
    };
*/
    let searchResponse = null;
    let llmResponse = null;
    let searchResponseUncurated = null;
    let curatedApps = null;
    let uncuratedApps = null;
    try {
      try {
        // Fetch search applications first
        searchResponse = await fetchSearchApplications(
          "/api/search/applications",
          data
        );
        // console.log("first searchResponse", searchResponse.data);
        setSearchAppData(searchResponse.data);
        // Now extract the applications from searchResponse to exclude
        curatedApps = searchResponse.data.map((app: any) => app.application);
        //setExcludeApplications(applicationsToExclude); // Set dynamic exclude list here
      } catch (err) {
        // console.error("Error fetching search applications:", err.message);
        setSearchAppData([]);
      }

      // search uncurated API
      try {
        // Fetch search uncuated applications next; we can still call fetchSearchApplications() with different endpoint
        searchResponseUncurated = await fetchSearchApplications(
          "/api/search/applications/uncurated",
          data
        );
        // console.log("first searchResponseUncurated", searchResponseUncurated.data);
        setSearchAppDataUncurated(searchResponseUncurated.data);
        // Now extract the applications from searchResponse to exclude
        uncuratedApps = searchResponseUncurated.data.map(
          (app: any) => app.application
        );
        //setExcludeApplications(applicationsToExclude); // Set dynamic exclude list here
      } catch (err) {
        // console.error(
        //   "Error fetching search applications (uncurated):",
        //   err.message
        // );
        setSearchAppDataUncurated([]);
      }

      const combinedExcludeList = [...curatedApps, ...uncuratedApps];
      //setExcludeApplications(combinedExcludeList);
      const llmData = {
        search_text: searchTerms,
        result_count: 8,
        exclude_applications: combinedExcludeList,
      };

      // fetch LLM API
      //TODO: Here we need to exclude both curated and uncurated apps obtained above.
      try {
        // console.log("llmData going on llm search:", llmData);
        llmResponse = await fetchLLMSearchApplications(
          "/api/search/llm/applications",
          llmData
        );
        // console.log("llmData", llmData);
        // console.log("llmResponse", llmResponse.data);
        setSearchLlmData(llmResponse.data);
      } catch (err) {
        // console.error("Error fetching LLM search applications:", err.message);
        setSearchLlmData([]);
      }
    } catch (err) {
      // console.log("Failed to fetch data from the application API.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    //if (event.key === "Enter" || event.key === " ") {
    if (event.key === "Enter") {
      setIsPressEnter(true);
      fetchSearchData();
    }
  };

  return (
    <div>
      <Header path="home" />
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="bg-[#F4F5F6] md:pt-[30px] pt-[15px] text-center h-[calc(100vh-74px)] overflow-auto pb-[100px]"
      >
        <div className="bg-[#F4F5F6] md:pt-[30px] pt-[15px] text-center h-[calc(100vh-74px)] overflow-auto pb-[100px]">
          <div className="md:max-w-[736px] max-w-[640px] mx-auto px-[12px]">
            {/* 
            <img
              src={mainlogo}
              alt="mainlogo"
              className="m-auto sm:w-[362px] w-[200px]"
            />
            */}
            <h1
              className="text-[#666666] sm:text-[28px] text-[20px] font-bold mt-[30px] mulish"
              data-testid="Simplifying AI for creators"
            >
              Curated AI products for your needs
            </h1>
            <div className="relative mt-[35px]">
              <img
                src={Search}
                alt="Search"
                className="absolute left-[12px] top-[50%] translate-y-[-50%]"
              />
              <input
                type="search"
                placeholder="e.g. I want to record, edit and transcribe my podcast to be used in social media."
                value={searchTerms}
                onChange={(e) => setSearchTerms(e.target.value)}
                onKeyDown={handleKeyDown}
                className="border-[#66666680] border-[1px] rounded-[10px] placeholder:text-[#666666] outline-none w-full h-[32px] sm:p-[25px_0px_25px_38px] p-[17px_0px_17px_38px] truncate min-w-[100px]"
              />
            </div>
            <div className="flex justify-between items-center sm:flex-row flex-col gap-2 sm:mt-[53px] mt-[33px] mb-">
              <div className="flex sm:flex-row flex-col items-center gap-2">
                {/*
              <Listbox value={feature} onChange={setFeatures}>
                {({ open }) => (
                  <>
                    <div className="relative sm:w-auto w-full">
                      <Listbox.Button className="relative w-full cursor-default rounded-md bg-[#465381] py-1.5 pl-3 pr-10 text-left text-white shadow-sm sm:text-sm sm:leading-6 mulish">
                        <span className="flex items-center">

                          <img src={Crown} alt="Crown" className="" />
                          <span className="ml-1 block truncate">
                            {feature.name}
                          </span>
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                          <IoMdArrowDropdown className="text-[22px]" />
                        </span>
                      </Listbox.Button>

                      <Transition
                        show={open}
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm pl-0">
                          {features.map((person) => (
                            <Listbox.Option
                              key={person.id}
                              className={({ active }) =>
                                classNames(
                                  active
                                    ? "bg-[#465381] text-white"
                                    : "text-gray-900",
                                  "relative cursor-default select-none py-2 pl-3 pr-9"
                                )
                              }
                              value={person}
                            >
                              {({ active }) => (
                                <>
                                  <div className="flex items-center">
                                    <span
                                      className={classNames(
                                        feature
                                          ? "font-semibold"
                                          : "font-normal",
                                        "ml-3 block truncate"
                                      )}
                                    >
                                      {person.name}
                                    </span>
                                  </div>

                                  {feature ? (
                                    <span
                                      className={classNames(
                                        active
                                          ? "text-white"
                                          : "text-[#465381]",
                                        "absolute inset-y-0 right-0 flex items-center pr-4"
                                      )}
                                    ></span>
                                  ) : null}
                                </>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </>
                )}
              </Listbox>
              */}
                {/*
              <Listbox value={category} onChange={setCategory}>
                {({ open }) => (
                  <>
                    <div className="relative sm:w-auto w-full">
                      <Listbox.Button className="border-[#46538180] border-[1px] relative w-full cursor-default rounded-md bg-[#fff] py-1.5 pl-3 pr-10 text-left text-[#465381] shadow-sm sm:text-sm sm:leading-6 mulish font-bold">
                        <span className="flex items-center">
                          <img src={Category} alt="Crown2" />
                          <span className="ml-1 block truncate">
                            {category.name}
                          </span>
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                          <IoMdArrowDropdown className="text-[22px]" />
                        </span>
                      </Listbox.Button>

                      <Transition
                        show={open}
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm pl-0">
                          {Categories.map((category) => (
                            <Listbox.Option
                              key={category.id}
                              className={({ active }) =>
                                classNames(
                                  active
                                    ? "bg-[#465381] text-white"
                                    : "text-gray-900",
                                  "relative cursor-default select-none py-2 pl-3 pr-9"
                                )
                              }
                              value={category}
                            >
                              {({ category, active }: any) => (
                                <>
                                  <div className="flex items-center">
                                    <span
                                      className={classNames(
                                        category
                                          ? "font-semibold"
                                          : "font-normal",
                                        "ml-3 block truncate"
                                      )}
                                    >
                                      {category.name}
                                    </span>
                                  </div>

                                  {category ? (
                                    <span
                                      className={classNames(
                                        active
                                          ? "text-white"
                                          : "text-[#465381]",
                                        "absolute inset-y-0 right-0 flex items-center pr-4"
                                      )}
                                    ></span>
                                  ) : null}
                                </>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </>
                )}
              </Listbox>
              */}
                {/*
              <Listbox value={day} onChange={setDay}>
                {({ open }) => (
                  <>
                    <div className="relative sm:w-auto w-full">
                      <Listbox.Button className="border-[#46538180] border-[1px] relative w-full cursor-default rounded-md bg-[#fff] py-1.5 pl-3 pr-10 text-left text-[#465381] shadow-sm sm:text-sm sm:leading-6 mulish font-bold">
                        <span className="flex items-center">
                          <img src={Calendar} alt="Calculator" />
                          <span className="ml-1 block truncate">
                            {day.name}
                          </span>
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                          <IoMdArrowDropdown className="text-[22px]" />
                        </span>
                      </Listbox.Button>

                      <Transition
                        show={open}
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm pl-0">
                          {Days.map((day) => (
                            <Listbox.Option
                              key={day.id}
                              className={({ active }) =>
                                classNames(
                                  active
                                    ? "bg-[#465381] text-white"
                                    : "text-gray-900",
                                  "relative cursor-default select-none py-2 pl-3 pr-9"
                                )
                              }
                              value={day}
                            >
                              {({ data, active }: any) => (
                                <>
                                  <div className="flex items-center">
                                    <span
                                      className={classNames(
                                        data ? "font-semibold" : "font-normal",
                                        "ml-3 block truncate"
                                      )}
                                    >
                                      {day.name}
                                    </span>
                                  </div>

                                  {day ? (
                                    <span
                                      className={classNames(
                                        active
                                          ? "text-white"
                                          : "text-[#465381]",
                                        "absolute inset-y-0 right-0 flex items-center pr-4"
                                      )}
                                    ></span>
                                  ) : null}
                                </>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </>
                )}
              </Listbox>
              */}
              </div>
              {/* <button className="flex justify-center border-[1px] border-[#000] rounded-[3px] py-[3px] px-[5px]">
              <img src={refresh} alt="refresh" /> Check other apps
            </button> */}
            </div>
            <AIData
              isLoading={isLoading}
              appData={appData}
              searchAppData={searchAppData}
              searchAppDataUncurated={searchAppDataUncurated}
              searchLlmData={searchLlmData}
              searchTerms={searchTerms}
              isPressEnter={isPressEnter}
            />
            {/* <AIData
            isLoading={isLoading}
            appData={searchLlmData}
            searchAppData={searchLlmData}
            searchTerms={searchTerms}
            isPressEnter={isPressEnter}
          /> */}
          </div>
        </div>
        {isLoading && <div>Loading...</div>}
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
