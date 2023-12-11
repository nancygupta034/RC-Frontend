import homeData from './home.json';
import ourStoryData from './our-story.json';

export default defineEventHandler(() => {
  return{
    homeData,
    ourStoryData
  }
})