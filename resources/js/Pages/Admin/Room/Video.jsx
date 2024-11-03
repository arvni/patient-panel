import React, {useState} from 'react';
import AgoraRTC, { AgoraRTCProvider } from 'agora-rtc-react';


const RoomMeetingPage = ({appId,token,channel}) => {

    const [client] = useState(() => AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }));
    const handleJoin = async () => {
        await client.join(appId, channel, token)
    };

    const handleLeave = async () => {
        await client.leave();
    };
    return (
        <div className="room-meeting-page">
            <h1>Room Meeting Page</h1>
            <button onClick={handleJoin}>Join Room Meeting</button>
            <button onClick={handleLeave}>Leave Room Meeting</button>
            <AgoraRTCProvider client={client}>

            </AgoraRTCProvider>
        </div>
    );
};

export default RoomMeetingPage;
