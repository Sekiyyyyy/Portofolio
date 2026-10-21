import Loader from "@/components/ui/3d-box-loader-animation";

const DemoOne = () => {
  return (
    <div className="flex w-full h-min-screen items-center justify-center min-h-screen bg-gray-200">
      <Loader />
    </div>
  );
};

export { DemoOne };
export default DemoOne;
