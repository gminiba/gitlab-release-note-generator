const _ = require("lodash");
const Gitlab = require("../adapters/gitlab");

exports.getMergeRequestByProjectIdStateStartDateAndEndDate = async (projectId, state, startDate, endDate, targetBranch) => {
  let { mergeRequests, _link } = await Gitlab.searchMergeRequestsByProjectId(projectId, {
    state,
    created_before: endDate,
    updated_after: startDate,
    target_branch: targetBranch
  });
  while (_.get(_link, "next")) {
    const res = await _link.next();
    mergeRequests = [...mergeRequests, ...res.mergeRequests];
    _link = res._link;
  }
  return mergeRequests;
};

exports.format = (mergeRequest) => {
  // Sample: Sample MR #1 (username)
  return `${mergeRequest.title} [#${mergeRequest.iid}](${mergeRequest.web_url}) ([${_.get(mergeRequest, "author.username")}](${_.get(mergeRequest, "author.web_url")}))`;
};
