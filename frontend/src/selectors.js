import { selectors as channelSelectors } from "./slices/channelsSlice";
import { selectors as messageSelectors } from "./slices/messagesSlice";

export const getChannels = channelSelectors.selectAll;
export const getMessages = messageSelectors.selectAll;

export const getCurrentChannelId = (state) => state.channels.currentChannelId;
