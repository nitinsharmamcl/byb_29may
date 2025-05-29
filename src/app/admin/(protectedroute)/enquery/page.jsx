"use client"

import React, { useEffect } from 'react'

import { Table } from 'react-bootstrap';
const Page = () => {
  const [enquiryData, setEnquiryData] = React.useState([]);
  const fetchData = async () => {
    try {
      const response = await fetch("/admin/api/enquiry/getEnquiry");
      const data = await response.json();
      console.log("Enquiry Data:", data);

      setEnquiryData(data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, [])

  return (

    <div className="dashboard-container">

      <div className='main-admin-content w-100'>

        <div className='dashboard-content p-3 '>

          <div className="table-responsive">
            <Table hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th> Name</th>
                  <th>Email</th>
                  <th> Contact No.</th>
                  <th> Course Name</th>

                  <th>message</th>
                </tr>
              </thead>
              <tbody>
                {enquiryData.length > 0 ? (
                  enquiryData.map((data) => (
                    <tr key={data.id}>
                      <td>{data.id}</td>
                      <td>{data.name}</td>
                      <td>{data.email}</td>
                      <td>{data.phone_number}</td>
                      <td>{data.course_name}</td>
                      <td>{data.message}</td>



                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

        </div>

      </div>
      {/* <style>{`
    .dashboard-content {
      margin-left: 126px !important;
    }
  `}</style> */}

    </div>
  )
}

export default Page