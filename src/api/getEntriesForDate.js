import axios from "axios";
import dayjs from "dayjs";

const getEntriesForDate = async (date) => {
  const formattedDate = dayjs(date).toISOString();
  const startOfDay = dayjs(formattedDate).startOf("day").toISOString();
  const endOfDay = dayjs(formattedDate).endOf("day").toISOString();

  const devTestData = [
    {
      Id: 0,
      date: "2022-02-07T15:00:00-05:00",
      time: "15:00",
      operator: "SrA Tidwell",
      entry: "Test entry test entry",
    },
    {
      Id: 1,
      date: dayjs("02/07/2022 12:00", "MM/DD/YYYY HH:mm").toISOString(),
      time: "12:00",
      operator: "SrA Test",
      entry: "Test entry test entry",
    },
    {
      Id: 3,
      date: dayjs("02/07/2022 18:00", "MM/DD/YYYY HH:mm").toISOString(),
      time: "18:00",
      operator: "SrA Test",
      entry: "Test entry test entry",
    },
    {
      Id: 4,
      date: dayjs("02/07/2022 05:00", "MM/DD/YYYY HH:mm").toISOString(),
      time: "05:00",
      operator: "SrA Test",
      entry: "Test entry test entry",
    },
    {
      Id: 5,
      date: dayjs("02/07/2022 06:00", "MM/DD/YYYY HH:mm").toISOString(),
      time: "06:00",
      operator: "SrA Test",
      entry: "Test entry test entry",
    },
  ];
  try {
    if (process.env.NODE_ENV === "development") return devTestData;

    const data = await axios.get(
      `${process.env.VUE_APP_API}/web/lists/getbytitle('mslLog')/items?$filter=date ge '${startOfDay}' and date le '${endOfDay}'&$orderby=date asc,time asc`,
      {
        headers: {
          Accept: "application/json; odata=verbose",
        },
        withCredentials: true,
      }
    );

    const results = data.data.d.results;

    return results;
  } catch (error) {
    if (error.response) {
      return Promise.reject(
        new Error(`${error.response.data} ${error.response.status}`)
      );
    }

    return Promise.reject(
      new Error(`${error.message?.value ? error.message.value : error.message}`)
    );
  }
};

export default getEntriesForDate;
