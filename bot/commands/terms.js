const docker = require("../docker.js");

module.exports = {
  name: "terms",
  async execute(client, event, args, db, reply) {
    reply({
      embeds: [
        {
          title: "Terms of Conditions",
          description: 
`**Last modified: February 12, 2021**\n\nWelcome to SMP Realms. These terms and conditions are rules and regulations for any use of SMP Realms.\n
By using SMP Realms, you must accept these terms and conditions, "Terms", and Privacy Policy, "Privacy" in full. Do not continue using SMP Realms if you do not accept all the terms and conditions stated on this page.\n
Our "Privacy" Policy is listed on the "/privacy" command.`,
          fields: [
            {
              name: 'Introduction',
              value: 
`These Terms are a legal agreement between you, "User", and us.\n
Keep in mind we are not affiliates with Discord.`
            },
            {
              name: 'Changes On Terms',
              value: 
`We may change the Terms and Privacy anytime. We will alert you when there is a change or Terms, or Privacy Policy.`
            },
            {
              name: 'Your Account',
              value: 
`Your account is linked to your Discord account. We are not responsible for any losses if your Discord account gets terminated.`
            },
            {
              name: 'Our access to any data given.',
              value: 
`We may access any information the User has given into our Services any time.\n
We may also access any Discord guild information into our Services any time.`
            },
            {
              name: 'Abuse',
              value: 
`Abusing our Services and any bugs is not allowed. Only share these and report any bugs you find to the bot owner(s). We may blacklist and/or terminate you any time without notice.\n
You agree to not DDOS nor commit any illegal actions to our Services.`
            },
            {
              name: 'Termination and Blacklist',
              value: 
`We may remove your data anytime and disallow you from accessing our Services anytime.\n
This includes that your access to the server may be removed.`
            },
            {
              name: 'Data Loss',
              value: 
`We are not held responsible for any data losses, nor warrenty is not given.\n
It is highly adviced to create and keep a backup of your world, using the /backup command. `
            },
            {
              name: 'WARRANTY',
              value: 
`THE SERVICES IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SERVICES OR THE USE OR OTHER DEALINGS IN THE SERVICES.`
            },
            {
              name: 'Limitation of Liability',
              value: 
`In no event shall the authors or copyright holders be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the Software or the use or other dealings in the Software.`
            }
          ]
        }
      ]
    });
  }
}