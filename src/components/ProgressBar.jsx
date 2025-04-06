import './ProgressBar.css'
import ProgressBar from "@ramonak/react-progress-bar";

export default function ProgressBarComponent({ value = 0 }) {
    return <div className='progressBar h-[10px] '>
        <ProgressBar
            height={'10px'}
            width={'100px'}
            completed={value}
            className="wrapper rounded-full"
            barContainerClassName="bg-gray-100 rounded-full"
            labelClassName="text-black text-[8px]  rounded-full"
        />
    </div>

}