import { useState, useCallback } from "react";
import {
  RangeSlider,
  Layout,
  Card,
  ChoiceList,
  TextField,
  Checkbox,
} from "@shopify/polaris";
import SalestormColorPicker from "./salestorm_color_picker";
import "../styles/components_salestorm_banner_formatter.css";

const SaleStormBannerFormatter = ({ campaign, setCampaignProperty }) => {
  const setStyleProperty = useCallback(
    (value, id) => {
      if (id === "boxShadow") {
        let boxShadow = campaign.styles.boxShadow.split(" ").slice(0, 3);
        setCampaignProperty(
          { ...campaign.styles, [id]: `${boxShadow.join(" ")} ${value}` },
          "styles"
        );
      } else {
        setCampaignProperty({ ...campaign.styles, [id]: value }, "styles");
      }
    },
    [campaign]
  );

  const [color, setColor] = useState({
    label: "Background color",
    value: "backgroundColor",
  });

  const colorChoices = [
    { label: "Background color", value: "backgroundColor" },
    { label: "Border color", value: "borderColor" },
    { label: "Box Shadow color", value: "boxShadow" },
  ];

  const [sides, setSides] = useState({
    left: true,
    right: true,
    top: true,
    bottom: true,
  });

  return (
    <Layout>
      {/*
    <Layout.Section>
      <Card>
        <Card.Section title="Pick which side of the banner you want to edit.">
              <div className='salestorm-banner-formatter-sides'>
            <Checkbox
              label="Apply styles to leftside"
              checked={sides.left}
              onChange={(value) => setSides({...sides, left: value})}
            />
            <Checkbox
              label="Apply styles to rightside"
              checked={sides.right}
              onChange={(value) => setSides({...sides, right: value})}
            />
            <Checkbox
              label="Apply styles to topside"
              checked={sides.top}
              onChange={(value) => setSides({...sides, top: value})}
            />
            <Checkbox
              label="Apply styles to bottomside"
              checked={sides.bottom}
              onChange={(value) => setSides({...sides, bottom: value})}
            />
          </div>
          </Card.Section>
        </Card>
      </Layout.Section>
      */}
      <Layout.Section>
        <Card>
          <Card.Section title="Pick Background and set colors">
            <div className="salestorm-banner-formatter-colors">
              <div>
                <ChoiceList
                  choices={colorChoices}
                  selected={color.value}
                  onChange={(option) => {
                    setColor(
                      colorChoices.find((choice) => choice.value === option[0])
                    );
                  }}
                />
              </div>
              <SalestormColorPicker
                onChange={(value) => setStyleProperty(value, color.value)}
                onTextChange={(value) => setStyleProperty(value, color.value)}
                color={campaign.styles[color.value]}
                allowAlpha
              />
            </div>
          </Card.Section>
        </Card>
      </Layout.Section>
      <Layout.Section>
        <Card>
          <Card.Section title="Set styles">
            <div className="salestorm-banner-formatter-styles">
              <RangeSlider
                label="Margin in px"
                value={parseInt(campaign.styles.margin)}
                onChange={(value) => setStyleProperty(`${value}px`, "margin")}
                output
              />
              <RangeSlider
                label="Padding in px"
                value={parseInt(campaign.styles.padding)}
                onChange={(value) => setStyleProperty(`${value}px`, "padding")}
                output
              />
              <RangeSlider
                label="Border Radius in px"
                value={parseInt(campaign.styles.borderRadius)}
                onChange={(value) =>
                  setStyleProperty(`${value}px`, "borderRadius")
                }
                output
              />
              <RangeSlider
                label="Border width in px"
                value={parseInt(campaign.styles.borderWidth)}
                onChange={(value) =>
                  handleStyleChange(`${value}px`, "borderWidth")
                }
                output
              />
              {console.log(campaign)}
              <div className="salestorm-banner-formatter-styles-height-width">
                <TextField
                  placeholder="width"
                  value={campaign.styles.width}
                  onChange={(value) => handleStyleChange(value, "width")}
                />
                <TextField
                  placeholder="height"
                  value={campaign.styles.height}
                  onChange={(value) => handleStyleChange(value, "height")}
                />
              </div>
            </div>
          </Card.Section>
        </Card>
      </Layout.Section>
    </Layout>
  );
};

export default SaleStormBannerFormatter;
