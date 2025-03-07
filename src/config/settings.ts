export const config = {
  faucetpay: {
    apiKey: 'YOUR_FAUCETPAY_API_KEY',
    currency: 'DOGE',
    minAmount: 0.01,
    maxAmount: 1,
    timerMinutes: 60,
    maxClaimsPerDay: 5,
  },
  captcha: {
    google: {
      siteKey: '6LdQZ-wqAAAAAFV6auwBiViMHS44o2LBHBQruN-l',
      secretKey: '6LdQZ-wqAAAAALBUe3Z8B7LpxYT9dfs72cqjZIvw',
    },
    hcaptcha: {
      siteKey: '9580eb5e-fb9a-4f0a-9718-e2123f085104',
    },
  },
  ads: {
    header: `<div id="frame" style="width: 100%;"><iframe data-aa='2384671' src='//acceptable.a-ads.com/2384671' style='border:0px; padding:0; width:100%; height:100%; overflow:hidden; background-color: transparent;'></iframe><a style="display: block; text-align: right; font-size: 12px" id="frame-link" href="https://aads.com/campaigns/new/?source_id=2384671&source_type=ad_unit&partner=2384671">Advertise here</a></div>`,
    sidebarTop: `<div id="frame" style="width: 100%;"><iframe data-aa='2384671' src='//acceptable.a-ads.com/2384671' style='border:0px; padding:0; width:100%; height:100%; overflow:hidden; background-color: transparent;'></iframe><a style="display: block; text-align: right; font-size: 12px" id="frame-link" href="https://aads.com/campaigns/new/?source_id=2384671&source_type=ad_unit&partner=2384671">Advertise here</a></div>`,
    sidebarMiddle: `<div id="frame" style="width: 100%;"><iframe data-aa='2384671' src='//acceptable.a-ads.com/2384671' style='border:0px; padding:0; width:100%; height:100%; overflow:hidden; background-color: transparent;'></iframe><a style="display: block; text-align: right; font-size: 12px" id="frame-link" href="https://aads.com/campaigns/new/?source_id=2384671&source_type=ad_unit&partner=2384671">Advertise here</a></div>`,
    sidebarBottom: `<div id="frame" style="width: 100%;"><iframe data-aa='2384671' src='//acceptable.a-ads.com/2384671' style='border:0px; padding:0; width:100%; height:100%; overflow:hidden; background-color: transparent;'></iframe><a style="display: block; text-align: right; font-size: 12px" id="frame-link" href="https://aads.com/campaigns/new/?source_id=2384671&source_type=ad_unit&partner=2384671">Advertise here</a></div>`,
    sidebarSticky: `<div id="frame" style="width: 100%;"><iframe data-aa='2384671' src='//acceptable.a-ads.com/2384671' style='border:0px; padding:0; width:100%; height:100%; overflow:hidden; background-color: transparent;'></iframe><a style="display: block; text-align: right; font-size: 12px" id="frame-link" href="https://aads.com/campaigns/new/?source_id=2384671&source_type=ad_unit&partner=2384671">Advertise here</a></div>`,
    footer: `<div id="frame" style="width: 100%;"><iframe data-aa='2384671' src='//acceptable.a-ads.com/2384671' style='border:0px; padding:0; width:100%; height:100%; overflow:hidden; background-color: transparent;'></iframe><a style="display: block; text-align: right; font-size: 12px" id="frame-link" href="https://aads.com/campaigns/new/?source_id=2384671&source_type=ad_unit&partner=2384671">Advertise here</a></div>`,
    inContent: `<div id="frame" style="width: 100%;"><iframe data-aa='2384671' src='//acceptable.a-ads.com/2384671' style='border:0px; padding:0; width:100%; height:100%; overflow:hidden; background-color: transparent;'></iframe><a style="display: block; text-align: right; font-size: 12px" id="frame-link" href="https://aads.com/campaigns/new/?source_id=2384671&source_type=ad_unit&partner=2384671">Advertise here</a></div>`,
  },
  sounds: {
    claim: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3',
  },
};