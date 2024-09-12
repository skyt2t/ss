import { Component } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { ThreeDots } from "react-loader-spinner";

import JobCard from "../JobCardPage";
import "./index.css"

class Jobs extends Component {
    state = {
        jobs: [],
        allJobs: [],
        hasMore: true,
        page: 1,
        loading: false,
        error: null
    }

    componentDidMount() {
        this.handleFetchJobs();
    }

    handleFetchJobs = () => {
        const { page, allJobs } = this.state;

        this.setState({ loading: true });

        axios.get(`https://testapi.getlokalapp.com/common/jobs?page=${page}`)
            .then(response => {
                const newJobs = response.data.results;

                if (newJobs.length > 0) {
                    this.setState(prevState => ({
                        jobs: [...prevState.jobs, ...newJobs],
                        allJobs: [...prevState.allJobs, ...newJobs],
                        page: prevState.page + 1,
                        loading: false
                    }));
                } else {
                    this.setState(prevState => ({
                        jobs: [...prevState.jobs, ...allJobs],
                        loading: false
                    }));
                }
            })
            .catch(error => {
                console.log('Error fetching jobs', error);
                this.setState({ loading: false, error: 'Failed to fetch jobs' });
            });
    }

    render() {
        const { jobs, hasMore, error } = this.state;

        return (
            <div className="jobs-container">
                <h1 className="title">Job Opportunities</h1>
                {error && <p className="error-message">{error}</p>}
                
                <InfiniteScroll
                    dataLength={jobs.length}
                    next={this.handleFetchJobs}
                    hasMore={hasMore}
                    loader={
                        <div className="loader-container">
                            <ThreeDots color="#0A74DA" height={80} width={80} />
                        </div>
                    }
                    endMessage={<h3>No more jobs available...</h3>}
                >
                    <div className="job-list">
                        {jobs.map((job, index) => (
                            <JobCard key={index} job={job} />
                        ))}
                    </div>
                </InfiniteScroll>
            </div>
        );
    }
}

export default Jobs;
