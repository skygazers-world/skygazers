import { MutatingDots } from  'react-loader-spinner'

const SkyLoader = ({
    color= "#DDB598"
}) => (
    <div className="w-full h-full min-h-[52vh] md:min-h-[60vh] flex flex-col justify-center items-center">
        <MutatingDots 
        height="100"
        width="100"
        color={color}
        secondaryColor= {color}
        radius='12.5'
        ariaLabel="mutating-dots-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        />
    </div>
  );
  
  export default SkyLoader;
  