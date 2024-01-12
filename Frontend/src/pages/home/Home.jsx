import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./home.scss";
import Widget from "../../components/widget/Widget";
import Featured from "../../components/featured/Featured";
import Chart from "../../components/chart/Chart";
import Table from "../../components/table/Table";
import MongoDBDashboard from "./MognoDBDashboard";

const Home = () => {
  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="widgets">
          <Widget type="user" />
          <Widget type="order" />
          <Widget type="earning" />
          <Widget type="balance" />
        </div>
        <div className="charts" style={{padding:'0',}}>
          {/* <Featured />
          <Chart title="Last 6 Months (Revenue)" aspect={2 / 1} /> */}
         <MongoDBDashboard/>
        </div>
        
      </div>
    </div>
  );
};

export default Home;
