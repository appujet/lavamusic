module.exports = async (client, node, error) => {

	client.logger.log(`Node "${node.options.identifier}" encountered an error: ${error.message}.`, "error");

}