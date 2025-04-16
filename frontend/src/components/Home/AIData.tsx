import { FC } from "react";
import RenderApplication from "./RenderApplication";

interface AIDataProps {
  isLoading: boolean;
  appData: any;
  searchAppData: any;
  searchAppDataUncurated: any;
  searchLlmData: any;
  searchTerms: string;
  isPressEnter: boolean;
}

const AIData: FC<AIDataProps> = ({
  isLoading,
  appData,
  searchAppData,
  searchAppDataUncurated,
  searchLlmData,
  searchTerms,
  isPressEnter,
}) => {
  const noDataFound =
    searchAppData.length === 0 && searchLlmData.length === 0 && !isLoading;

  return (
    <div className="mb-[30px]">
      {isLoading && (
        <div className="loaderSearch">
          <span></span>
        </div>
      )}

      {!isPressEnter &&
        !isLoading &&
        appData.map((val: any, index: any) => (
          <RenderApplication val={val} key={`app-${index}`} />
        ))}

      {isPressEnter && searchTerms !== "" && !isLoading && (
        <>
          {searchAppData?.length > 0 &&
            searchAppData.map((val: any, index: any) => (
              <RenderApplication
                val={val}
                key={`searchApp-${index}`}
                searchText={searchTerms}
              />
            ))}
          <h4 className="mt-12 text-[black] text-left">
            Additional Uncurated Options from huby:
          </h4>

          {/* Render uncurated products search data   */}
          {searchAppDataUncurated &&
            searchAppDataUncurated.length > 0 &&
            searchAppDataUncurated.map((val: any, index: any) => (
              <RenderApplication
                val={val}
                key={`searchAppUncurated-${index}`}
                showReviews={true}
                appName={val.application}
                searchText={searchTerms}
              />
            ))}

          {/* Render LLM Data */}
          <h4 className="mt-12 text-[black] text-left">
            Options from external sources:
          </h4>
          {searchLlmData &&
            searchLlmData.length > 0 &&
            searchLlmData.map((val: any, index: any) => (
              <RenderApplication
                val={val}
                key={`searchLlm-${index}`}
                showReviews={true}
                appName={val.application}
                searchText={searchTerms}
              />
            ))}

          {noDataFound && <h5 className="mt-4 text-[red]">No data Found!</h5>}
        </>
      )}
    </div>
  );
};

export default AIData;
