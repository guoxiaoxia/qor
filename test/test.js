const assert = require('assert');
const Qor = require('../index.js');
Qor.config({
	srcPath: `${__dirname}/../examples`
});
const UserInfoObject = Qor.Object('user.info');
const UserMessageRelation = Qor.Relation('user.message');

const USER_ID = '00000000000000000000000000000000';
const MESSAGE_IDS = [0, 1, 2];
const MESSAGE_CREATE_TIMES = [946656000, 978278400, 1009814400];
const MESSAGE_REPLY_TIMES = [946656000, 978278400, 1009814400];
const MESSAGE_SENDER_NAMES = ['john', 'tom', 'vivian'];

describe("qor", function() {
	describe("object", function() {
		it("set - should return without error", async function() {
			await UserInfoObject.set(USER_ID, {
				name: "ray2",
				age: 19,
				isMarried: false,
				statistic: {
					loginTimes: 1,
					logoutTimes: 2
				}
			});
		});

		it("get - should return object instant", async function() {
			let {object: userInfo} = await UserInfoObject.get(USER_ID);
			assert(userInfo.name === 'ray2', 'name should be ray2');
			assert(userInfo.statistic.logoutTimes === 2, 'statistic.logoutTimes should be 2');
		});

		it("del - should return null after deletion", async function() {
			await UserInfoObject.del(USER_ID);
			let {object: userInfo} = await UserInfoObject.get(USER_ID);
			assert(userInfo === null, 'should be null after deletion');
		});
	});
	describe("relation", function() {
		it("put 3 messages - should return without error", async function() {
			await Promise.all([0,1,2].map((idx) => {
				return UserMessageRelation.put(USER_ID, MESSAGE_IDS[idx], {
					createTime: MESSAGE_CREATE_TIMES[idx],
					replyTime: MESSAGE_REPLY_TIMES[idx],
					senderName: MESSAGE_SENDER_NAMES[idx]
				});
			}));
		});

		it("check existence of the third message - should return true", async function() {
			let has = await UserMessageRelation.has(USER_ID, MESSAGE_IDS[2]);
			assert(has, "has should be true");
		});

		it("fetch the second - should return senderName = tom", async function() {
			let {relation: userMessage} = await UserMessageRelation.fetch(USER_ID, MESSAGE_IDS[1]);
			assert(userMessage.senderName === 'tom', "senderName should be tom");
		});

		it("count - should return count of 3", async function() {
			let count = await UserMessageRelation.count(USER_ID);
			assert(count === 3, "count should be 3");
		});

		it("list all - should return an array of length 3", async function() {
			let results = await UserMessageRelation.descendSearch(USER_ID, 'createTime', 0);
			assert(results.length === 3, "length should be 3");
			assert(results[0].relation.senderName === 'vivian', "first senderName should be vivian");
		});

		it("remove - should return an array of length 2", async function() {
			await UserMessageRelation.remove(USER_ID, MESSAGE_IDS[0]);
			let results = await UserMessageRelation.ascendSearch(USER_ID, 'senderName', 0);
			assert(results.length === 2, "length should be 2");
		});

		it("clear - should return an empty array", async function() {
			await UserMessageRelation.clear(USER_ID);
			let results = await UserMessageRelation.ascendSearch(USER_ID, 'senderName', 0);
			assert(results.length === 0, "length should be 0");
		});
	});
});