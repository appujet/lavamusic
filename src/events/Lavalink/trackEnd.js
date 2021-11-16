module.exports = async (client, player, track, playload) => {

    const autoplay = player.get("autoplay")
    if (autoplay === true) {
        const requester = player.get("requester");
        const oldidentifier = player.get("identifier");
        const identifier = player.queue.current.identifier;
        const search = `https://www.youtube.com/watch?v=${identifier}&list=RD${identifier}`;
        res = await player.search(search, requester);
		player.queue.add(res.tracks[2]);
    }
	
}