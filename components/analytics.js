import { useRef, useEffect, useState } from 'react';
import {
  Card,
  Layout,
  ResourceList,
  ResourceItem,
  EmptyState,
  TextStyle,
  Badge,
  Icon,
  TextField,
  Button,
} from '@shopify/polaris';
import {
  ViewMajor,
  OrdersMajor,
  CashDollarMajor,
  DeleteMajor,
} from '@shopify/polaris-icons';
import Chart from 'chart.js';

import '../styles/components/analytics.css';

const Analytics = ({ views, days, campaigns, currencyFormatter, sales }) => {
  const [sortValue, setSortValue] = useState('REVENUE');
  const [items, setItems] = useState(campaigns);
  const periodRef = useRef();
  const ordersPieRef = useRef();
  const salesSum =
    sales.length > 0 ? sales.reduce((total, sale) => total + sale) : 0;
  const viewsSum =
    views.length > 0 ? views.reduce((total, sale) => total + sale) : 0;
  const viewsColor = '#008060';
  const orderColor = '#ff7900';
  const formattedDays = days.map((day) => {
    return new Intl.DateTimeFormat([], {
      day: 'numeric',
      month: 'short',
      timezone: 'UTC',
    }).format(new Date(day));
  });
  useEffect(() => {
    if (periodRef.current) {
      // eslint-disable-next-line no-new
      new Chart(periodRef.current, {
        type: 'bar',
        data: {
          labels: formattedDays,
          datasets: [
            {
              data: views,
              backgroundColor: viewsColor,
              label: 'Views',
            },
            {
              data: sales,
              backgroundColor: orderColor,
              label: 'Sales',
            },
          ],
        },
        options: {
          maintainAspectRatio: false,
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  stepSize: 5,
                },
              },
            ],
          },
        },
      });
    }
    if (ordersPieRef.current) {
      // eslint-disable-next-line no-new
      new Chart(ordersPieRef.current, {
        type: 'doughnut',
        data: {
          datasets: [
            {
              data: [viewsSum, salesSum],
              backgroundColor: [viewsColor, orderColor],
            },
          ],
          labels: ['Views', 'Sales'],
        },
        options: {
          maintainAspectRatio: false,
        },
        centerText: `${(
          (salesSum / (viewsSum > 0 ? viewsSum : 1)) *
          100
        ).toFixed(2)}%`,
        plugins: [
          {
            beforeDraw(chart) {
              const width = chart.chart.width;
              const height = chart.chart.height;
              const ctx = chart.chart.ctx;

              ctx.restore();
              ctx.font = '25pt Arial';
              ctx.textBaseline = 'top';
              ctx.fillStyle = 'grey';

              const text = chart.config.centerText;
              const textX = Math.round(
                (width - ctx.measureText(text).width) / 1.97
              );
              const textY = height / 2;

              ctx.fillText(text, textX, textY);
              ctx.save();
            },
          },
        ],
      });
    }
  }, [days, views, sales, salesSum]);

  const emptyStateCampaignMarkup = (
    <>
      <br />
      <EmptyState
        heading="No campaigns available to analyze."
        action={{ content: 'Create a new Campaign', url: '/campaigns/new' }}
        image="/business_analytics.svg"
      >
        <p>Create a new upselling campaign now.</p>
      </EmptyState>
    </>
  );

  return (
    <div className="salestorm-campaigns-analytics">
      <Card>
        <Card.Section title="External tracking">
          <p className="salestorm-analytics-subheading">
            Track Add to cart events.
          </p>
          <br />
          <div className="salestorm-external-tracking-information">
            {/* TODO: save this tracking id and use it onclick on the claim offer button to track the add to cart event */ }
            <TextField
              label="Google Analytics Tacking ID"
              placeholder="UA-XXXXXX-Y"
              onChange={text => console.log(text)}
              value=''
            />
            &nbsp;
            <Button primary>Save</Button>
          </div>
        </Card.Section>
      </Card>
      <Card>
        <Card.Section title="Views & Sales overview">
          <p className="salestorm-analytics-subheading">
            Total campaign Views & Sales this month.
          </p>
          <br />
          <div className="slaestorm-analytics-chart">
            <canvas ref={periodRef} />
          </div>
        </Card.Section>
      </Card>
      <br />
      <Layout>
        <Layout.Section oneHalf>
          <Card>
            <Card.Section title="Total Conversion Rate">
              <p className="salestorm-analytics-subheading">
                Total Sales VS Total Views this month.
              </p>
              <br />
              <div className="slaestorm-analytics-chart">
                <canvas ref={ordersPieRef} />
              </div>
            </Card.Section>
          </Card>
        </Layout.Section>
        <Layout.Section oneHalf>
          <Card>
            <Card.Section title="Campaign Performance">
              <p className="salestorm-analytics-subheading">
                See the best performing campaigns this month.
              </p>
              <div className="salestorm-campaigns-overview">
                <ResourceList
                  resourceName={{ singular: 'campaign', plural: 'campaigns' }}
                  emptyState={emptyStateCampaignMarkup}
                  items={items}
                  showHeader
                  sortOptions={[
                    { label: 'Sales', value: 'SALES' },
                    { label: 'Revenue', value: 'REVENUE' },
                    { label: 'Views', value: 'VIEWS' },
                  ]}
                  onSortChange={(selected) => {
                    if (selected === 'SALES') {
                      const helperItems = items.sort((campaignA, campaignB) =>
                        campaignA.sales > campaignB.sales ? -1 : 1
                      );
                      setItems(helperItems);
                    } else if (selected === 'REVENUE') {
                      const helperItems = items.sort((campaignA, campaignB) =>
                        campaignA.revenue > campaignB.revenue ? -1 : 1
                      );
                      setItems(helperItems);
                    } else if (selected === 'VIEWS') {
                      const helperItems = campaigns.sort(
                        (campaignA, campaignB) =>
                          campaignA.views > campaignB.views ? -1 : 1
                      );
                      setItems(helperItems);
                    }
                    setSortValue(selected);
                  }}
                  sortValue={sortValue}
                  renderItem={(campaign) => {
                    const {
                      views: campaignViews,
                      sales: campaignSales,
                      revenue,
                      id,
                      name,
                      deleted,
                    } = campaign;
                    const url = deleted ? '' : `/campaigns/${id}`;
                    const viewsLabel = `${campaignViews} View${
                      campaignViews === 1 ? '' : 's'
                    }`;
                    const salesLabel = `${campaignSales} Sale${
                      campaignSales === 1 ? '' : 's'
                    }`;
                    const formattedRevenue = currencyFormatter
                      ? currencyFormatter.format(revenue)
                      : revenue;
                    return (
                      <ResourceItem url={url}>
                        <h3 className="salestorm-campaign-title">
                          <TextStyle>{name}</TextStyle>
                        </h3>
                        <Badge status="success">
                          <Icon source={ViewMajor} />
                          <TextStyle variation="strong">{viewsLabel}</TextStyle>
                        </Badge>
                        <Badge status="warning">
                          <Icon source={OrdersMajor} />
                          <TextStyle variation="strong">{salesLabel}</TextStyle>
                        </Badge>
                        <Badge status="attention">
                          <Icon source={CashDollarMajor} />
                          <TextStyle variation="strong">
                            {formattedRevenue} generated
                          </TextStyle>
                        </Badge>
                        {deleted && (
                          <Badge status="critical">
                            <Icon source={DeleteMajor} />
                            <TextStyle variation="strong">Deleted</TextStyle>
                          </Badge>
                        )}
                      </ResourceItem>
                    );
                  }}
                />
              </div>
            </Card.Section>
          </Card>
        </Layout.Section>
      </Layout>
    </div>
  );
};

export default Analytics;
