export default function SubmissionFormLeftSide({ headtitle, paratag }) {
  return (
    <>
      <div className="lg:w-[50%] w-full">
        <h1 className="md:text-[40px] sm:text-[30px] text-[26px] roboto font-bold mb-4">
          {headtitle}
        </h1>
        <p className="mt-[24px] text-[16px] roboto mb-0 text-black">
          {paratag}
        </p>
      </div>
    </>
  );
}
