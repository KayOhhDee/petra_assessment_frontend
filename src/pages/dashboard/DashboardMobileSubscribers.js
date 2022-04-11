import React from 'react'
import { useQuery, useMutation } from 'urql';
import { sentenceCase } from 'change-case';
import { format } from 'date-fns';
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
// material
import { Container, Card, Table, TableContainer, TableCell, TableRow, TableBody, Typography, Stack, Button, Divider, TableFooter } from '@mui/material'
// components
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';
import Label from '../../components/Label';
import { ListHead, MoreMenu, DeleteDialog } from '../../components/@general';
import { ListToolbar } from '../../components/_dashboard/mobile-subscribers';
import { AddMobileSubscriber } from '../../components/_adds';

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
    subscribers (cursor: null, limit: 20) {
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

const DeleteSubscriberMutation = `
mutation DeleteMobileSubscriber($id: Float!) {
  deleteMobileSubscriber(id: $id)
}
`;

const DashboardMobileSubscribers = () => {
  const [isSubscriberEditOpen, setIsSubscriberEditOpen] = React.useState(false);
  const [selectedSubscriber, setSelectedSubscriber] = React.useState(null);
  const [isSubscriberDeleteOpen, setIsSubscriberDeleteOpen] = React.useState(false);

  // ---------------------------------------------------------------------------

  const [result] = useQuery({
    query: SubscribersQuery
  });
  const { data, fetching, error } = result;

  // ---------------------------------------------------------------------------

  const [, deleteMobileSubscriber] = useMutation(DeleteSubscriberMutation);

  // ---------------------------------------------------------------------------

  const handleEdit = (subscriber) => {
    setSelectedSubscriber(subscriber);
    setIsSubscriberEditOpen(true);
  }

  const handleDelete = (subscriber) => {
    setSelectedSubscriber(subscriber);
    setIsSubscriberDeleteOpen(true);
  }

  // ---------------------------------------------------------------------------

  React.useEffect(() => {
    if (!isSubscriberEditOpen) {
      setSelectedSubscriber(null);
    }
  }, [isSubscriberEditOpen]);

  // ---------------------------------------------------------------------------

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;
  console.log(data);
  return (
    <Page title="Mobile Subscribers">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Mobile Subscribers
          </Typography>
          <AddMobileSubscriber
            isOpen={isSubscriberEditOpen}
            setIsOpen={setIsSubscriberEditOpen}
            selectedItem={selectedSubscriber}
          >
            <Button variant="contained" component="div" startIcon={<Icon icon={plusFill} />}>
              Add
            </Button>
          </AddMobileSubscriber>
        </Stack>

        <Card>
          <ListToolbar />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <ListHead
                  headLabel={TABLE_HEAD}
                />
                <TableBody>
                  {(data.subscribers.subscribers)
                    .map((row, index) => {
                      const { id, msisdn, serviceType, serviceStartDate, ownerSubscriber: { name: ownerName }, userSubscriber: { name: userName } } =
                        row;

                      const date = new Date(parseInt(serviceStartDate, 10));

                      return (
                        <TableRow
                          key={id}
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
                            <MoreMenu
                              handleEdit={() => handleEdit(row)}
                              onDelete={() => handleDelete(row)}
                            />
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
              <Button onClick={() => {}}>Load More</Button>
            </TableCell>
          </TableFooter>
        </Card>
        {isSubscriberDeleteOpen && (
          <DeleteDialog
            isOpen={isSubscriberDeleteOpen}
            setIsOpen={setIsSubscriberDeleteOpen}
            selectedItem={selectedSubscriber}
            delFunc={deleteMobileSubscriber}
          />
        )}
      </Container>
    </Page>
  )
}

export default DashboardMobileSubscribers