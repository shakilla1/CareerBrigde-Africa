import Hero from "../../../components/home/Hero/Hero";
import Statistics from "../../../components/home/Statistics/Statistics";
import FeaturedJobs from "../../../components/home/FeaturedJobs/FeaturedJobs";
import HowItWorks from "../../../components/home/HowItWorks/HowItWorks";
import Mentorship from "../../../components/home/Mentorship/Mentorship";
import SuccessStories from "../../../components/home/SuccessStories/SuccessStories";
import CallToAction from "../../../components/home/CallToAction/CallToAction";

function Home() {
  return (
    <>
      <Hero />
      <Statistics />
      <FeaturedJobs />
      <HowItWorks />
      <Mentorship />
      <SuccessStories />
      <CallToAction />
    </>
  );
}

export default Home;