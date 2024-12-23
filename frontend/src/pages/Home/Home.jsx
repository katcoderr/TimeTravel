import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import axiosInstance from '../../utils/axiosInstance';
import TravelStoryCard from '../../components/Cards/TravelStoryCard';

const Home = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState("");
  const [allstories, setAllstories] = useState([])

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user")
      if (response.data && response.data.user) {
        setUserInfo(response.data.user)
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear()
        navigate("/login")
      }
    }
  }

  const getAllStories = async () => {
    try {
      const response = await axiosInstance.get("/get-all-stories")
      if (response.data && response.data.stories) {
        setAllstories(response.data.stories)
      }
    } catch (error) {
      console.log("An unexpected error has occured. Please try again");

    }
  }

  const handleEdit = (data) => {
  }

  const handleViewStory = (data) => { }

  const updateIsFavourite = async (storyData) => {
    const storyId = storyData._id
    try {
      const response = await axiosInstance.put("/update-is-favourite/" + storyId, {
        isFavourite: !storyData.isFavourite
      })

      if (response.data && response.data.story) {
        getAllStories()
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again");

    }
  }

  useEffect(() => {
    getAllStories()
    getUserInfo()
    return () => { }
  }, [])



  return (
    <>
      <Navbar userInfo={userInfo} />

      <div className="container mx-auto py-10">
        <div className="flex gap-7">
          <div className="flex-1">
            {allstories.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {allstories.map((item) => {
                  return (
                    <TravelStoryCard
                      key={item._id}
                      imgUrl={item.imageUrl}
                      title={item.title}
                      story={item.story}
                      date={item.visitedDate}
                      visitedLocation={item.visitedLocation}
                      isFavourite={item.isFavourite}
                      onEdit={() => handleEdit(item)}
                      onClick={() => handleViewStory(item)}
                      onFavouriteClick={() => updateIsFavourite(item)}
                    />
                  )
                })}
              </div>
            ) : (<>Empty Card Here</>)}
          </div>
          <div className="w-[320px]"></div>
        </div>
      </div>
    </>
  );
};

export default Home;
