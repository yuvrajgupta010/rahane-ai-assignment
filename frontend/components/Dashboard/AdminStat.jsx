import { apiInterceptor } from "@/service/axiosClient";
import restfulUrls from "@/service/restfulUrls";
import React, { useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";

const AdminStat = (props) => {
  // const [dashboardStat, setDashboardStat] = useState(null);

  // useEffect(() => {
  //   const fetchDashboardStat = async () => {
  //     try {
  //       const responseData = await apiInterceptor.get(
  //         restfulUrls.GET_DASHBOARD_DATA
  //       );
  //       if (responseData.status === 200) {
  //         const data = responseData?.data?.data;
  //         // console.log(data);
  //         setDashboardStat(data);
  //       }
  //     } catch (error) {
  //       console.error(
  //         error?.data?.data?.message || "Unable to get dashboard data"
  //       );
  //     }
  //   };
  //   fetchDashboardStat();
  // }, []);

  return (
    <Container>
      <Row className="gap-4">
        <Col>
          <Card className="text-center bg-light" text="">
            <Card.Body>
              <Card.Title className="fw-bold">{props?.totalUsers}</Card.Title>
              <Card.Text>Total users</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col>
          <Card className="text-center bg-light">
            <Card.Body>
              <Card.Title className="fw-bold">{props?.totalLogs}</Card.Title>
              <Card.Text>System Events</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminStat;
