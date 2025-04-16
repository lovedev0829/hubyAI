import TopResult from "../../components/TopResult/TopResult"
import SearchHeader from "../../components/SearchHeader/SearchHeader"
import SearchResults from "../../components/SearchResults/SearchResults"
import SearchFooter from "../../components/SearchFooter/SearchFooter"


const SearchPage = () => {
  return (
      <>
           <SearchHeader />
          <TopResult />
          <SearchResults />
          <SearchFooter/>
      </>
  )
}

export default SearchPage