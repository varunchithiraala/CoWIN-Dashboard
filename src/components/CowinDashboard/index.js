// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class CowinDashboard extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    vaccinationData: {},
  }

  componentDidMount() {
    this.getVaccinationData()
  }

  getVaccinationData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const covidVaccinationDataApiUrl =
      'https://apis.ccbp.in/covid-vaccination-data'
    const response = await fetch(covidVaccinationDataApiUrl)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = {
        last7DaysVaccination: fetchedData.last_7_days_vaccination.map(
          eachDayVaccination => ({
            vaccineDate: eachDayVaccination.vaccine_date,
            dose1: eachDayVaccination.dose_1,
            dose2: eachDayVaccination.dose_2,
          }),
        ),
        vaccinationByAge: fetchedData.vaccination_by_age.map(
          eachVaccinationByAge => ({
            age: eachVaccinationByAge.age,
            count: eachVaccinationByAge.count,
          }),
        ),
        vaccinationByGender: fetchedData.vaccination_by_gender.map(
          eachVaccinationByGender => ({
            count: eachVaccinationByGender.count,
            gender: eachVaccinationByGender.gender,
          }),
        ),
      }
      this.setState({
        vaccinationData: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderVaccinationStats = () => {
    const {vaccinationData} = this.state
    return (
      <>
        <VaccinationCoverage
          vaccinationCoverageDetails={vaccinationData.last7DaysVaccination}
        />
        <VaccinationByGender
          vaccinationByGenderDetails={vaccinationData.vaccinationByGender}
        />
        <VaccinationByAge
          vaccinationByAgeDetails={vaccinationData.vaccinationByAge}
        />
      </>
    )
  }

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        className="failure-view-image"
        alt="failure view"
      />
      <h1 className="failure-view-heading">Something went wrong</h1>
    </div>
  )

  renderLoader = () => (
    <div data-testid="loader" className="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  renderAPIStatusView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderVaccinationStats()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="cowin-dashboard-app-container">
        <div className="cowin-dashboard-container">
          <div className="cowin-dashboard-logo-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
              className="cowin-dashboard-logo-image"
              alt="website logo"
            />
            <h1 className="cowin-dashboard-logo-heading">Co-WIN</h1>
          </div>
          <h1 className="cowin-dashboard-heading">
            CoWIN Vaccination in India
          </h1>
          {this.renderAPIStatusView()}
        </div>
      </div>
    )
  }
}

export default CowinDashboard
