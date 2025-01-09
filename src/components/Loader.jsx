
export default function Loader({ children }) {
    return (
        <div className="fixed top-0 left-0 w-screen h-screen flex flex-col justify-center  bg-[#060b1d83] items-center z-50">
            <div aria-label="Loading..." role="status" className="flex flex-col justify-center items-center space-x-2">
                <svg className="text-gradient-to-r from-blue-400 from-50%  to-orange-400 to-50% bg-clip" 
                width="40" height="45" viewBox="0 0 135 140" xmlns="http://www.w3.org/2000/svg" fill="#fb923c">
                    <rect y="10" width="15" height="120" rx="6">
                        <animate attributeName="height"
                            begin="0.5s" dur="1s"
                            values="120;110;100;90;80;70;60;50;40;140;120" calcMode="linear"
                            repeatCount="indefinite" />
                        <animate attributeName="y"
                            begin="0.5s" dur="1s"
                            values="10;15;20;25;30;35;40;45;50;0;10" calcMode="linear"
                            repeatCount="indefinite" />
                    </rect>
                    <rect x="30" y="10" width="15" height="120" rx="6">
                        <animate attributeName="height"
                            begin="0.25s" dur="1s"
                            values="120;110;100;90;80;70;60;50;40;140;120" calcMode="linear"
                            repeatCount="indefinite" />
                        <animate attributeName="y"
                            begin="0.25s" dur="1s"
                            values="10;15;20;25;30;35;40;45;50;0;10" calcMode="linear"
                            repeatCount="indefinite" />
                    </rect>
                    <rect x="60" width="15" height="140" rx="6">
                        <animate attributeName="height"
                            begin="0s" dur="1s"
                            values="120;110;100;90;80;70;60;50;40;140;120" calcMode="linear"
                            repeatCount="indefinite" />
                        <animate attributeName="y"
                            begin="0s" dur="1s"
                            values="10;15;20;25;30;35;40;45;50;0;10" calcMode="linear"
                            repeatCount="indefinite" />
                    </rect>
                    <rect x="90" y="10" width="15" height="120" rx="6">
                        <animate attributeName="height"
                            begin="0.25s" dur="1s"
                            values="120;110;100;90;80;70;60;50;40;140;120" calcMode="linear"
                            repeatCount="indefinite" />
                        <animate attributeName="y"
                            begin="0.25s" dur="1s"
                            values="10;15;20;25;30;35;40;45;50;0;10" calcMode="linear"
                            repeatCount="indefinite" />
                    </rect>
                    <rect x="120" y="10" width="15" height="120" rx="6">
                        <animate attributeName="height"
                            begin="0.5s" dur="1s"
                            values="120;110;100;90;80;70;60;50;40;140;120" calcMode="linear"
                            repeatCount="indefinite" />
                        <animate attributeName="y"
                            begin="0.5s" dur="1s"
                            values="10;15;20;25;30;35;40;45;50;0;10" calcMode="linear"
                            repeatCount="indefinite" />
                    </rect>
                </svg>
                <span className="text-white text-[14px]">{children}</span>
            </div>
        </div>
    )
}


