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
  Link,
} from '@shopify/polaris';
import {
  ViewMajor,
  OrdersMajor,
  CashDollarMajor,
  DeleteMajor,
} from '@shopify/polaris-icons';
import { Chart, registerables } from 'chart.js';
import { useRouter } from 'next/router';

const Analytics = ({ views, days, campaigns, currencyFormatter, sales }) => {
  const router = useRouter();
  const [sortValue, setSortValue] = useState('REVENUE');
  const [items, setItems] = useState(campaigns);
  const periodRef = useRef();
  const ordersPieRef = useRef();
  const salesSum =
    sales.length > 0 ? sales.reduce((total, sale) => total + sale) : 0;
  const viewsSum =
    views.length > 0 ? views.reduce((total, sale) => total + sale) : 0;
  const viewsColor = '#008060';
  const orderColor = '#C83E4D';
  const formattedDays = days.map((day) => {
    return new Intl.DateTimeFormat([], {
      day: 'numeric',
      month: 'short',
      timezone: 'UTC',
    }).format(new Date(day));
  });
  useEffect(() => {
    if (periodRef.current) {
      Chart.register(...registerables);
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
              data: [viewsSum - salesSum, salesSum],
              backgroundColor: [viewsColor, orderColor],
            },
          ],
          labels: ['Views', 'Sales'],
        },
        options: {
          maintainAspectRatio: false,
        },
        plugins: [
          {
            beforeDraw(chart) {
              const width = chart.width;
              const height = chart.height;
              const ctx = chart.ctx;

              ctx.restore();
              ctx.font = '25pt Arial';
              ctx.textBaseline = 'top';
              ctx.fillStyle = 'grey';

              const text = `${(
                (salesSum / (viewsSum > 0 ? viewsSum : 1)) *
                100
              ).toFixed(2)}%`;
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
  }, [days, views, sales, salesSum, Chart]);

  const emptyStateCampaignMarkup = (
    <>
      <br />
      <EmptyState
        heading="No campaigns available to analyze."
        action={{
          content: 'Create a new Campaign',
          onAction: () => router.push('/campaigns/new'),
        }}
        image="/business_analytics.svg"
      >
        <p>Create a new upselling campaign now.</p>
      </EmptyState>
    </>
  );

  return (
    <div className="campaigns-analytics">
      <p className="analytics-subheading">
        Searching for an option to track Add to cart events ? Google Analytics
        is doing just that for you with a UA-XXXXXXXX-X code.{' '}
        <Link
          url="https://help.shopify.com/en/manual/reports-and-analytics/google-analytics/google-analytics-setup"
          external
        >
          Follow this Shopify help article
        </Link>{' '}
        for setup instructions. Using a GA4 property already ?{' '}
        <Link url="mailto:support@sailstorm.cc" external>
          Get help
        </Link>{' '}
        setting it up.
      </p>
      <br />
      <Card>
        <Card.Section title="Views and sales overview">
          <p className="analytics-subheading">
            Total campaign views and sales this month.
          </p>
          <br />
          <div className="analytics-chart">
            <canvas aria-label="total-campaign-views" ref={periodRef} />
          </div>
        </Card.Section>
      </Card>
      <br />
      <Layout>
        <Layout.Section oneHalf>
          <Card>
            <Card.Section title="Total conversion rate">
              <p className="analytics-subheading">
                Total sales vs total views this month.
              </p>
              <br />
              <div className="analytics-chart">
                <canvas
                  aria-label="total-sales-vs-total-views"
                  ref={ordersPieRef}
                />
              </div>
            </Card.Section>
          </Card>
        </Layout.Section>
        <Layout.Section oneHalf>
          <Card>
            <Card.Section title="Campaign performance">
              <p className="analytics-subheading">
                See the best performing campaigns this month.
              </p>
              <div className="campaigns-overview">
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
                    const viewsLabel = `${campaignViews} view${
                      campaignViews === 1 ? '' : 's'
                    }`;
                    const salesLabel = `${campaignSales} sale${
                      campaignSales === 1 ? '' : 's'
                    }`;
                    const formattedRevenue = currencyFormatter
                      ? currencyFormatter.format(revenue)
                      : revenue;
                    return (
                      <div className='analytics-performance-list-item'>
                      <ResourceItem onClick={() => router.push(url)}>
                        <h3 className="campaign-title">
                          <TextStyle>{name}</TextStyle>
                        </h3>
                        <div className='analytics-performance-props'>
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
                              <TextStyle variation="strong">deleted</TextStyle>
                            </Badge>
                          )}
                        </div>
                      </ResourceItem>
                      </div>
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
