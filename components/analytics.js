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
} from '@shopify/polaris';
import {
  ViewMajor,
  OrdersMajor,
  CashDollarMajor,
} from '@shopify/polaris-icons';
import Chart from 'chart.js';

import '../styles/components/analytics.css';

const Analytics = ({
  views,
  days,
  campaigns,
  currencyFormatter,
  sales,
}) => {
  const [sortValue, setSortValue] = useState('REVENUE');
  const [items, setItems] = useState(campaigns);
  const periodRef = useRef();
  const ordersPieRef = useRef();
  const viewsSum =
    views.length > 0 ? views.reduce((total, view) => total + view) : 0;
  const salesSum =
    sales.length > 0 ? sales.reduce((total, sale) => total + sale) : 0;
  const viewsColor = '#008060';
  const orderColor = '#ff7900';
  useEffect(() => {
    if (periodRef.current) {
      new Chart(periodRef.current, {
        type: 'bar',
        data: {
          labels: days,
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
        centerText: `${((salesSum / viewsSum) * 100).toFixed(2)}%`,
        plugins: [
          {
            beforeDraw(chart, options) {
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
  }, [periodRef.current, ordersPieRef.current]);

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
        <Card.Section title="Views & Sales overview">
          <p className="salestorm-analytics-subheading">
            Total campaign Views & Sales over time.
          </p>
          <br />
          <div className="slaestorm-analytics-chart">
            <canvas id="myChart" ref={periodRef} />
          </div>
        </Card.Section>
      </Card>
      <br />
      <Layout>
        <Layout.Section oneHalf>
          <Card>
            <Card.Section title="Total Conversion Rate">
              <p className="salestorm-analytics-subheading">
                Total Sales VS Total Views.
              </p>
              <br />
              <div className="slaestorm-analytics-chart">
                <canvas id="myChart" ref={ordersPieRef} />
              </div>
            </Card.Section>
          </Card>
        </Layout.Section>
        <Layout.Section oneHalf>
          <Card>
            <Card.Section title="Campaign Performance">
              <p className="salestorm-analytics-subheading">
                See the best performing campaigns.
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
                    const { views, sales, revenue, id, name } = campaign;
                    const url = `/campaigns/${id}`;
                    return (
                      <ResourceItem url={url}>
                        <h3 className="salestorm-campaign-title">
                          <TextStyle>{name}</TextStyle>
                        </h3>
                        <Badge status="success">
                          <Icon source={ViewMajor} />
                          <TextStyle variation="strong">
                            {views} View{views === 1 ? '' : 's'}
                          </TextStyle>
                        </Badge>
                        <Badge status="warning">
                          <Icon source={OrdersMajor} />
                          <TextStyle variation="strong">
                            {sales} Sale
                            {sales === 1 ? '' : 's'}
                          </TextStyle>
                        </Badge>
                        <Badge status="attention">
                          <Icon source={CashDollarMajor} />
                          <TextStyle variation="strong">
                            {currencyFormatter
                              ? currencyFormatter.format(revenue)
                              : revenue} generated
                          </TextStyle>
                        </Badge>
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
