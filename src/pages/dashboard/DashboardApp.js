import React from 'react'
import { Link as RouterLink } from 'react-router-dom';
import { useQuery } from 'urql';
import { sentenceCase } from 'change-case';
import { format } from 'date-fns';
// materal
import { Container, Card, Table, TableContainer, TableCell, TableRow, TableBody, Typography, Box, Button, TableFooter, Divider } from '@mui/material'
// components
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';
import Label from '../../components/Label';
import SummaryWidget from '../../sections/app/SummaryWidget';
import { ListHead, MoreMenu } from '../../components/@general';

const TABLE_HEAD = [
  { id: 'msisdn', label: 'Msisdn', alignRight: false },
  { id: 'owner', label: 'Owner', alignRight: false },
  { id: 'user', label: 'User', alignRight: false },
  { id: 'startdate', label: 'Start Date', alignRight: false },
  { id: 'servicetype', label: 'Service Type', alignRight: false },
  { id: '' }
];

const SubscribersQuery = `
  query {
    subscribers (cursor: null, limit: 5) {
    subscribers {
      id
      msisdn
      serviceType
      customerIdUser
      customerIdOwner
      serviceStartDate
      ownerSubscriber {
        id
        name
      }
      userSubscriber {
        id
        name
      }
    }

    hasMore
    }
  }
`;

const SummaryQuery = `
query {
  mobileSubscriberSummary {
    subscribersCount
    subscribersPrepaidCount
    subscribersPostpaidCount
  }
}
`;

const DashboardApp = () => {
  const subscribersResponse = useQuery({
    query: SubscribersQuery,
  });

  const summaryResponse = useQuery({
    query: SummaryQuery,
  });

  const {
    data: subscribersData,
    fetching: subscribersFetching,
    error: subscribersError
  } = subscribersResponse[0];

  const {
    data: summaryData,
    fetching: summaryFetching,
    error: summaryError
  } = summaryResponse[0];

  // if (fetching) return <p>Loading...</p>;
  // if (error) return <p>Oh no... {error.message}</p>;

  return (
    <Page title="App">
      <Container>
        <Box sx={{ pb: 5 }}>
          {!summaryFetching ? (
            <SummaryWidget summary={summaryData} />
          ) : (
            <p>Loading...</p>
          )}
        </Box>

        {!subscribersFetching ? (<Card sx={{ pt: 1 }}>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <ListHead
                  headLabel={TABLE_HEAD}
                />
                <TableBody>
                  {(subscribersData.subscribers.subscribers)
                    .map((row, index) => {
                      const { msisdn, serviceType, serviceStartDate, ownerSubscriber: { name: ownerName }, userSubscriber: { name: userName } } =
                        row;
                      const date = new Date(parseInt(serviceStartDate, 10));

                      return (
                        <TableRow
                          key={index}
                          tabIndex={-1}
                        >
                          <TableCell>
                            <Typography variant="subtitle2" noWrap>
                              {index + 1}
                            </Typography>
                          </TableCell>
                          <TableCell align="left">
                            {msisdn || '-'}
                          </TableCell>
                          <TableCell align="left">{ownerName || '-'}</TableCell>
                          <TableCell align="left">{userName || '-'}</TableCell>
                          <TableCell align="left">
                            <Typography variant="subtitle2">
                              {serviceStartDate ? format(date, 'dd MMM yyyy') : 'N/A'}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              {serviceStartDate ? format(date, 'p') : 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Label
                              variant="ghost"
                              sx={{ cursor: 'pointer' }}
                              color={
                                (serviceType === 'MOBILE_PREPAID' && 'warning') || 'info'
                              }
                            >
                              {sentenceCase(serviceType)}
                            </Label>
                          </TableCell>
                          <TableCell align="right">
                            <MoreMenu />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
          <Divider />
          <TableFooter sx={{ float: "right" }}>
            <TableCell>
              <Button component={RouterLink} to={`/mobile-subscribers`}>View All</Button>
            </TableCell>
          </TableFooter>
        </Card>) : 'loading...'}
      </Container>
    </Page>
  )
}

export default DashboardApp