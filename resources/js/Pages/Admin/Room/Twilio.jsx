// MeetingPage.js
import React, {useState, useEffect, useRef} from 'react';
import Video from 'twilio-video';

const MeetingPage = ({accessToken, roomName}) => {
    const [room, setRoom] = useState(null);
    const [participants, setParticipants] = useState([]);
    const handleJoinRoom = async () => {
        try {
            // Connect to Twilio Video room using access token
            const videoRoom = await Video.connect(accessToken, {
                name: roomName, // Unique room name
                audio: true,
                video: true
            });

            // Set up event listeners for room events
            videoRoom.on('participantConnected', participant => {
                console.log(participant);
                setParticipants(prevParticipants => [...prevParticipants, participant]);
            });

            videoRoom.on('participantDisconnected', participant => {
                setParticipants(prevParticipants => prevParticipants.filter(p => p !== participant));
            });

            setRoom(videoRoom);
        } catch (error) {
            console.error('Error joining room:', error);
        }
    };

    const handleDisconnectRoom = () => {
        console.log(participants, room);
        if (room) {
            room.disconnect();
            setRoom(null);
        }
    }

    return (
        <div className="meeting-page">
            <h1>Meeting Page</h1>
            <button onClick={handleJoinRoom}>Join Room</button>
            <button onClick={handleDisconnectRoom}>DisconnectRoom</button>
            <div className="video-grid">
                {participants.map(participant => (
                    <div key={participant.sid}>
                        <Participant participant={participant}/>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Participant = ({participant}) => {
    const [videoTracks, setVideoTracks] = useState([]);

    useEffect(() => {
        console.log(participant.videoTracks.values());
        setVideoTracks(Array.from(participant.videoTracks.values()));

        const trackSubscribed = track => {
            setVideoTracks(prevTracks => [...prevTracks, track]);
        };

        const trackUnsubscribed = track => {
            setVideoTracks(prevTracks => prevTracks.filter(t => t !== track));
        };

        participant.on('trackSubscribed', trackSubscribed);
        participant.on('trackUnsubscribed', trackUnsubscribed);

        return () => {
            setVideoTracks([]);
            participant.removeAllListeners();
        };
    }, [participant]);

    return (
        <div className="participant">
            <div className="video-container">
                {videoTracks.map(item => (
                    <VideoTrack key={item?.trackSid} track={item.track}/>
                ))}
            </div>
        </div>
    );
};

const VideoTrack = ({track}) => {
    const videoRef = useRef();

    useEffect(() => {
        if (track)
            track.attach(videoRef.current);

        return () => {
            if (track)
                track.detach();
        };
    }, [track]);

    return <video ref={videoRef} autoPlay/>;
};

export default MeetingPage;
