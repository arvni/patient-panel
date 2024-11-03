import {useEffect, useState} from "react";
import "./client.css";
import EnxRtc from "../../services/EnxRtc.js";
import {IconButton} from "@mui/material";
import {Mic, PhoneDisabled, Videocam} from "@mui/icons-material";

import VideoCamOffIcon from '@mui/icons-material/VideocamOff';


const ToolBar = ({video_muted}) => {

    return <div className="toolbar-buttons">
        <div className="tools">
            <IconButton className="mute-icon"
                        title="Mute/Unmute Audio"
                        id="self_aMute">
                <Mic/>
            </IconButton>
            <IconButton color="error"
                        className="video-mute-icon"
                        id="mute_video"
                        title="Mute/Unmute Video">
                <VideoCamOffIcon/>
            </IconButton>
            <IconButton color="error"
                        className="video-mute-icon end-call"
                        title="End Call"
                        id="disconnect_call">
                <PhoneDisabled/>
            </IconButton>
        </div>
    </div>
}

const Client = ({token}) => {
    console.log(token);
    let ATList = [];
    let audio_muted = false;
    let video_muted = false;
    let video_type = "SD";

    let room = null;
    let SubscribedStreamMap = new Map();
    let localStream,
        remote_view,
        sAMute = true,
        sVMute = true,
        rAmute = true,
        rVMute = true;

    let optionsLocal;
    let remoteOptions;
    let isModerator;
    let VideoSize = {
        'HD': [320, 180, 1280, 720],
        'SD': [640, 480, 640, 480],
        'LD': [80, 45, 640, 360]
    };
    let config = {
        video: true,
        audio: true,
        data: true,
        videoSize: VideoSize[video_type],
    };

    optionsLocal = {
        player: {
            height: "150px",
            width: "150px",
            minHeight: "150px",
            minWidth: "150px",
        },
        toolbar: {
            displayMode: false,
        },
        resizer: false,
    };
    remoteOptions = {
        player: {
            height: "100%",
            width: "100%",
        },
        resizer: false,
        toolbar: {
            displayMode: true,
        },
    };

    // useEffect(() => {
    //     joinRoom();
    // }, []);
    let joinRoom = () => {
        console.log('joining the room...');
        EnxRtc.Logger.setLogLevel(0);
        localStream = EnxRtc.joinRoom(token, config, function (success, error) {
            if (error) {
                console.log(error);
                document.querySelector(".error_div").innerHTML = "Room connection error." + error.message;
            }
            // if room connects successfully
            if (success) {
                console.log(success)
                //play local view
                localStream.play("self-view", optionsLocal);

                // assigning room object to a variable
                room = success.room;
                // check if the user joined as moderator or participant
                isModerator = room.me.role === "moderator";
                var ownId = success.publishId;
                for (var i = 0; i < success.streams.length; i++) {
                    room.subscribe(success.streams[i]);
                }
                // Active talkers handling
                room.addEventListener("active-talkers-updated", function (event) {
                    console.log("Active Talker List :- " + JSON.stringify(event));
                    var video_player_len = document.querySelector("#call_div").childNodes;

                    ATList = event.message.activeList;

                    if (
                        event.message &&
                        event.message.activeList
                    ) {
                        if (ATList.length === 0) {
                            document.querySelector("#call_div").innerHTML = "";
                            document.querySelector(".remote-name").innerText = "";
                        }
                        if (SubscribedStreamMap.size > 0) {

                            if (video_player_len.length >= 1) {

                            } else {
                                for (var stream in room.remoteStreams.getAll()) {
                                    var st = room.remoteStreams.getAll()[stream];
                                    for (var j = 0; j < ATList.length; j++) {
                                        if (ATList[j].streamId === st.getID()) {
                                            remote_view = st;
                                            document.querySelector(".self-name").innerHTML = room.me.name;
                                            st.play("call_div", remoteOptions);
                                            document.querySelector(".remote-name").innerHTML = ATList[j].name;
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
                room.addEventListener("stream-subscribed", function (streamEvent) {
                    if (streamEvent.stream.getID() !== ownId) {
                        SubscribedStreamMap.set(
                            streamEvent.stream.getID(),
                            streamEvent.stream
                        );
                    }
                });


                // user disconnection notification
                room.addEventListener("user-disconnected", function (streamEvent) {
                    document.querySelector("#call_div").innerHTML = "";
                    document.querySelector(".remote-name").innerText = "";
                });
                // room disconnected notification
                room.addEventListener("room-disconnected", function (streamEvent) {
                    window.location.href = "/";
                });
            }
        });

        // self stream audio mute/unmute  function
        document.querySelector("#self_aMute").addEventListener('click', handleToggleMic);
        document.querySelector("#disconnect_call").addEventListener("click", handleDisconnect);
        document.querySelector('#mute_video').addEventListener('click', handleToggleVideo);

    }

    const handleDisconnect = () => room.disconnect();
    const handleToggleMic = () => {
        if (audio_muted) {
            if (room.mute) {
                console.log("Your audio is muted by moderator");
            } else {
                localStream.unmuteAudio(function (arg) {
                    audio_muted = false;
                });
            }
        } else {
            localStream.muteAudio(function (arg) {
                audio_muted = true;
            });
        }
    }
    const handleToggleVideo = () => {
        let el = document.getElementById("mute_video")
        if (video_muted) {
            localStream.unmuteVideo(function (res) {
                if (res.result === 0) {
                    video_muted = false;
                } else if (res.result === 1140) {
                    console.error(res.error);
                }
            });
        } else {
            localStream.muteVideo(function (res) {
                if (res.result === 0) {
                    video_muted = true;
                }
            });
        }
    }

    return (
        <div>
            <div className="layout">
                <div className="container">
                    <div className="row p-0 m-0" id="call_container_div">
                        <div className="local_class_peep" id="local_view">
                            <div id="self-view"/>
                            <div className="self-name">Local User</div>
                        </div>

                        <div className="remote_class_peep" id="remote_view">
                            <div id="call_div"/>
                            <div id="show_stream_div"/>
                            <div className="remote-name">Remote User</div>
                        </div>
                        <ToolBar video_muted={video_muted}/>
                    </div>
                </div>
            </div>

        </div>
    )
}
export default Client;
