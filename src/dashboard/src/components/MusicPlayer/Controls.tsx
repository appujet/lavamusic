import React from "react";
import { MdSkipNext, MdSkipPrevious } from "react-icons/md";
import {
    BsArrowRepeat,
    BsFillPauseFill,
    BsFillPlayFill,
    BsShuffle,
} from "react-icons/bs";


type Props = {
    isPlaying: boolean;
    repeat: string;
    setRepeat: any;
    shuffle: boolean;
    setShuffle: any;
    currentSongs: any;
    handlePlayPause: any;
    handlePrevSong: any;
    handleNextSong: any;
}


export default function PlayerControls({
    isPlaying,
    repeat,
    setRepeat,
    shuffle,
    setShuffle,
    currentSongs,
    handlePlayPause,
    handlePrevSong,
    handleNextSong,
}: Props) {

    

}





